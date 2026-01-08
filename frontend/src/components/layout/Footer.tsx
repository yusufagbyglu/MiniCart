import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-gray-50/50 pt-16 pb-8">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold tracking-tight text-gray-900">
                                Mini<span className="text-indigo-600">Cart</span>
                            </span>
                        </Link>
                        <p className="max-w-xs text-sm leading-relaxed text-gray-600">
                            The ultimate destination for premium shopping. Quality products delivered to your doorstep with love and care.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <Link key={i} href="#" className="text-gray-400 transition-colors hover:text-indigo-600">
                                    <Icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900">Quick Links</h4>
                        <ul className="flex flex-col gap-3">
                            {["Shop All", "New Arrivals", "Best Sellers", "Offers", "About Us"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-gray-600 transition-colors hover:text-indigo-600 hover:underline">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900">Support</h4>
                        <ul className="flex flex-col gap-3">
                            {["Help Center", "Shipping Policy", "Returns & Refunds", "Privacy Policy", "Terms of Service"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-gray-600 transition-colors hover:text-indigo-600 hover:underline">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900">Contact Us</h4>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-center gap-3 text-sm text-gray-600">
                                <MapPin className="h-4 w-4 text-indigo-600" />
                                <span>123 Shopping St, Retail City, RC 45678</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-600">
                                <Phone className="h-4 w-4 text-indigo-600" />
                                <span>+1 (234) 567-890</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-600">
                                <Mail className="h-4 w-4 text-indigo-600" />
                                <span>support@minicart.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-16 border-t pt-8 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} MiniCart. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
