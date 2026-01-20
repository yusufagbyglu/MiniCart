import React from "react";
import { ShippingDetail } from "@/services/admin/shipping-service";
import Badge from "@/components/admin/ui/badge/Badge";
import Button from "@/components/admin/ui/button/Button";
import { PencilIcon } from "@/icons";

interface TrackingInfoCardProps {
    shippingDetail: ShippingDetail;
    onEdit: () => void;
}

const getTrackingUrl = (carrier: string | null, trackingNumber: string | null) => {
    if (!carrier || !trackingNumber) return "";

    switch (carrier.toLowerCase()) {
        case 'ups': return `https://www.ups.com/track?tracknum=${trackingNumber}`;
        case 'fedex': return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
        case 'usps': return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
        case 'dhl': return `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`;
        default: return "";
    }
};

export default function TrackingInfoCard({ shippingDetail, onEdit }: TrackingInfoCardProps) {
    return (
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-50 dark:bg-brand-500/10 rounded-lg text-brand-600 dark:text-brand-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                            Shipment Information
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                            via {shippingDetail.carrier}
                        </p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={onEdit} startIcon={<PencilIcon className="w-3.5 h-3.5" />}>
                    Edit
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                    <span className="block text-gray-500 dark:text-gray-400 text-xs mb-1">Tracking Number</span>
                    <div className="flex items-center gap-2 font-mono text-gray-800 dark:text-white font-medium bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded border border-gray-100 dark:border-gray-700 w-fit">
                        {getTrackingUrl(shippingDetail.carrier, shippingDetail.tracking_number) ? (
                            <a
                                href={getTrackingUrl(shippingDetail.carrier, shippingDetail.tracking_number)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
                            >
                                {shippingDetail.tracking_number}
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </a>
                        ) : (
                            shippingDetail.tracking_number
                        )}
                    </div>
                </div>

                <div>
                    <span className="block text-gray-500 dark:text-gray-400 text-xs mb-1">Status</span>
                    {shippingDetail.delivered_at ? (
                        <Badge color="success" size="sm">Delivered</Badge>
                    ) : (
                        <Badge color="info" size="sm">In Transit</Badge>
                    )}
                </div>

                <div>
                    <span className="block text-gray-500 dark:text-gray-400 text-xs mb-1">Shipped Date</span>
                    <span className="text-gray-800 dark:text-white">
                        {new Date(shippingDetail.shipped_at).toLocaleDateString()}
                    </span>
                </div>

                {shippingDetail.delivered_at && (
                    <div>
                        <span className="block text-gray-500 dark:text-gray-400 text-xs mb-1">Delivered Date</span>
                        <span className="text-gray-800 dark:text-white">
                            {new Date(shippingDetail.delivered_at).toLocaleDateString()}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
