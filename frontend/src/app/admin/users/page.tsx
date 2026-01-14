"use client";

import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table";
import Badge from "@/components/admin/ui/badge/Badge";
import { adminUserService } from "@/services/admin/user-service";
import { PencilIcon, TrashBinIcon } from "@/icons";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await adminUserService.getUsers();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Customers
                </h3>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                            <TableRow>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Name
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Email
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Roles
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Joined
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <TableRow>
                                    <TableCell className="py-4 text-center" colSpan={5}>Loading...</TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell className="py-4 text-center" colSpan={5}>No users found</TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                            {user.name}
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {user.email}
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles?.map((role: any) => (
                                                    <Badge key={role.id} size="sm" color="info">
                                                        {role.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="py-3 text-end">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="text-gray-500 hover:text-brand-500">
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button className="text-gray-500 hover:text-error-500">
                                                    <TrashBinIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
