"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/admin/ui/modal";
import Input from "@/components/admin/form/input/InputField";
import Label from "@/components/admin/form/Label";
import { adminUserService } from "@/services/admin/user-service";
import toast from "react-hot-toast";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user?: any | null;
}

export default function UserModal({ isOpen, onClose, onSuccess, user }: UserModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                password: "", // Don't populate password for security
            });
        } else {
            setFormData({
                name: "",
                email: "",
                password: "",
            });
        }
    }, [user, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData: any = {
                name: formData.name,
                email: formData.email,
            };

            // Only include password if it's provided
            if (formData.password) {
                submitData.password = formData.password;
            }

            if (user) {
                if (!formData.password && !submitData.password) {
                    delete submitData.password;
                }
                await adminUserService.updateUser(user.id, submitData);
                toast.success("User updated successfully!");
            } else {
                if (!formData.password) {
                    toast.error("Password is required for new users");
                    setLoading(false);
                    return;
                }
                submitData.password = formData.password;
                await adminUserService.createUser(submitData);
                toast.success("User created successfully!");
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error saving user:", error);
            toast.error(error.response?.data?.message || "Failed to save user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                {user ? "Edit User" : "Add New User"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label>Name</Label>
                    <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter user name"
                        required
                    />
                </div>

                <div>
                    <Label>Email</Label>
                    <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        required
                    />
                </div>

                <div>
                    <Label>{user ? "New Password (leave blank to keep current)" : "Password"}</Label>
                    <Input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter password"
                        required={!user}
                    />
                    {user && (
                        <p className="text-xs text-gray-500 mt-1">
                            Leave blank to keep the current password
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 flex items-center gap-2"
                        disabled={loading}
                    >
                        {loading && (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        )}
                        {user ? "Update User" : "Create User"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
