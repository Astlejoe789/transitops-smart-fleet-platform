import { Search, SlidersHorizontal, ChevronDown, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

interface TripItem {
  id: string;
  tripNumber: string;
  origin: string;
  destination: string;
  driverName: string;
  driverAvatar: string;
  vehicle: string;
  status: 'In Progress' | 'Completed' | 'Scheduled' | 'Cancelled';
  departure: string;
}

const TRIPS_DATA: TripItem[] = [
  { id: '1', tripNumber: 'TR-2048', origin: 'Los Angeles, CA', destination: 'San Diego, CA', driverName: 'John D.', driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', vehicle: 'VH-104', status: 'In Progress', departure: 'May 28, 08:30 AM' },
  { id: '2', tripNumber: 'TR-2047', origin: 'Las Vegas, NV', destination: 'Phoenix, AZ', driverName: 'Mike R.', driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', vehicle: 'VH-112', status: 'Completed', departure: 'May 28, 07:45 AM' },
  { id: '3', tripNumber: 'TR-2046', origin: 'San Francisco, CA', destination: 'Sacramento, CA', driverName: 'Sarah K.', driverAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', vehicle: 'VH-131', status: 'Completed', departure: 'May 27, 04:15 PM' },
  { id: '4', tripNumber: 'TR-2045', origin: 'Portland, OR', destination: 'Seattle, WA', driverName: 'David L.', driverAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', vehicle: 'VH-118', status: 'In Progress', departure: 'May 27, 01:30 PM' },
  { id: '5', tripNumber: 'TR-2044', origin: 'Dallas, TX', destination: 'Houston, TX', driverName: 'Mark T.', driverAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', vehicle: 'VH-105', status: 'Scheduled', departure: 'May 29, 06:00 AM' },
  { id: '6', tripNumber: 'TR-2043', origin: 'Miami, FL', destination: 'Orlando, FL', driverName: 'Chris P.', driverAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80', vehicle: 'VH-120', status: 'Scheduled', departure: 'May 29, 09:00 AM' },
  { id: '7', tripNumber: 'TR-2042', origin: 'Chicago, IL', destination: 'Indianapolis, IN', driverName: 'Brian S.', driverAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', vehicle: 'VH-107', status: 'Cancelled', departure: 'May 26, 11:00 AM' },
  { id: '8', tripNumber: 'TR-2041', origin: 'Atlanta, GA', destination: 'Nashville, TN', driverName: 'James W.', driverAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', vehicle: 'VH-113', status: 'Completed', departure: 'May 26, 08:20 AM' },
];

export function TripsTableWidget() {
  const getStatusBadge = (status: TripItem['status']) => {
    switch (status) {
      case 'In Progress':
        return <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-[11px] font-bold">In Progress</span>;
      case 'Completed':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">Completed</span>;
      case 'Scheduled':
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 text-[11px] font-bold">Scheduled</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[11px] font-bold">Cancelled</span>;
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-[20px] bg-[#0B1426]/80 border border-surface-800/40 p-5">
      
      {/* Search & Action Filters Header Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input 
            type="text" 
            placeholder="Search trips by number, origin, or destination..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-900/60 border border-surface-800/80 text-[13px] text-white placeholder-surface-500 focus:outline-none focus:border-primary-500/50"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-900/60 border border-surface-800/80 text-[13px] font-medium text-surface-300 hover:text-white transition-colors">
            <span>All Statuses</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-900/60 border border-surface-800/80 text-[13px] font-medium text-surface-300 hover:text-white transition-colors">
            <span>More Filters</span>
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Title & View All */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-bold text-white" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
          Recent Trips
        </h3>
        <button className="text-[12px] font-semibold text-primary-400 hover:text-primary-300 transition-colors">
          View all
        </button>
      </div>

      {/* Trips Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12.5px] border-collapse">
          <thead>
            <tr className="border-b border-surface-800/40 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
              <th className="py-3 px-3">Trip #</th>
              <th className="py-3 px-3">Origin</th>
              <th className="py-3 px-3">Destination</th>
              <th className="py-3 px-3">Driver</th>
              <th className="py-3 px-3">Vehicle</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Departure</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800/30">
            {TRIPS_DATA.map((trip) => (
              <tr key={trip.id} className="hover:bg-surface-800/20 transition-colors">
                <td className="py-3.5 px-3 font-bold text-white">{trip.tripNumber}</td>
                <td className="py-3.5 px-3 text-surface-300">{trip.origin}</td>
                <td className="py-3.5 px-3 text-surface-300">{trip.destination}</td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-2">
                    <img 
                      src={trip.driverAvatar} 
                      alt={trip.driverName} 
                      className="h-6 w-6 rounded-full object-cover border border-surface-700" 
                    />
                    <span className="font-medium text-white">{trip.driverName}</span>
                  </div>
                </td>
                <td className="py-3.5 px-3 font-medium text-surface-300">{trip.vehicle}</td>
                <td className="py-3.5 px-3">{getStatusBadge(trip.status)}</td>
                <td className="py-3.5 px-3 text-surface-400">{trip.departure}</td>
                <td className="py-3.5 px-3 text-right">
                  <button className="p-1 rounded text-surface-400 hover:text-white hover:bg-surface-800/50 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-surface-800/40 mt-4 text-[12px] text-surface-400">
        <div>Showing 1 to 8 of 128 trips</div>

        <div className="flex items-center gap-1.5">
          <button className="h-7 w-7 rounded-lg border border-surface-800 flex items-center justify-center text-surface-400 hover:text-white transition-colors">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button className="h-7 w-7 rounded-lg bg-primary-600 text-white font-bold flex items-center justify-center">
            1
          </button>
          <button className="h-7 w-7 rounded-lg border border-surface-800 flex items-center justify-center text-surface-400 hover:text-white transition-colors">
            2
          </button>
          <button className="h-7 w-7 rounded-lg border border-surface-800 flex items-center justify-center text-surface-400 hover:text-white transition-colors">
            3
          </button>
          <span className="px-1 text-surface-500">...</span>
          <button className="h-7 w-7 rounded-lg border border-surface-800 flex items-center justify-center text-surface-400 hover:text-white transition-colors">
            16
          </button>
          <button className="h-7 w-7 rounded-lg border border-surface-800 flex items-center justify-center text-surface-400 hover:text-white transition-colors">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
