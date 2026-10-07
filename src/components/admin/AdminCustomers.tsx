import { useState } from 'react';
import { User, Phone, MapPin, Package, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { callAdminData } from '@/lib/adminData';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  created_at: string;
  order_count?: number;
  total_spent?: number;
}

const AdminCustomers = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const [{ data: profilesData, error: profilesError }, { data: ordersData, error: ordersError }] = await Promise.all([
        callAdminData({ table: 'profiles' }),
        callAdminData({ table: 'orders' }),
      ]);

      if (profilesError && ordersError) {
        console.error('Error fetching customer data:', profilesError || ordersError);
        throw profilesError || ordersError;
      }

      const profilesList: Profile[] = (profilesData || []) as Profile[];
      const ordersList: any[] = ordersData || [];

      // Map to aggregate customers
      const customerMap = new Map<string, Profile>();

      // 1. Add all registered profiles
      profilesList.forEach((profile) => {
        const key = (profile.user_id || profile.id).toLowerCase();
        customerMap.set(key, {
          ...profile,
          order_count: 0,
          total_spent: 0,
        });
      });

      // 2. Process orders to add stats and guest customers
      ordersList.forEach((order) => {
        const orderAmount = Number(order.total_amount) || 0;
        let matchedKey: string | null = null;

        // Try matching by user_id
        if (order.user_id) {
          const uKey = order.user_id.toLowerCase();
          if (customerMap.has(uKey)) {
            matchedKey = uKey;
          }
        }

        // Try matching by phone or customer_name if not matched by user_id
        if (!matchedKey) {
          for (const [key, cust] of customerMap.entries()) {
            const phoneMatch = order.phone && cust.phone && order.phone.trim() === cust.phone.trim();
            const nameMatch = order.customer_name && cust.full_name && order.customer_name.trim().toLowerCase() === cust.full_name.trim().toLowerCase();
            if (phoneMatch || nameMatch) {
              matchedKey = key;
              break;
            }
          }
        }

        if (matchedKey && customerMap.has(matchedKey)) {
          const cust = customerMap.get(matchedKey)!;
          cust.order_count = (cust.order_count || 0) + 1;
          cust.total_spent = (cust.total_spent || 0) + orderAmount;
          if (!cust.phone && order.phone) cust.phone = order.phone;
          if (!cust.city && order.shipping_city) cust.city = order.shipping_city;
          if (!cust.address && order.shipping_address) cust.address = order.shipping_address;
        } else {
          // Create entry for customer who placed orders without profile
          const guestIdentifier = (order.user_id || order.phone || order.customer_name || order.id).toLowerCase();
          customerMap.set(guestIdentifier, {
            id: order.id,
            user_id: order.user_id || order.id,
            full_name: order.customer_name || 'Guest Customer',
            phone: order.phone || null,
            address: order.shipping_address || null,
            city: order.shipping_city || null,
            created_at: order.created_at,
            order_count: 1,
            total_spent: orderAmount,
          });
        }
      });

      return Array.from(customerMap.values());
    },
  });

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      (customer.full_name && customer.full_name.toLowerCase().includes(query)) ||
      (customer.phone && customer.phone.toLowerCase().includes(query)) ||
      (customer.city && customer.city.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-normal text-[#242024]">Customers</h2>
          <p className="text-xs text-[#716b70] mt-0.5">Overview of registered client accounts and activity</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9a9298]" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 w-64 rounded-xl border-[#d8cfd3] bg-white text-sm text-[#3f393e] placeholder:text-[#b1a8ad] focus-visible:border-[#a35d70] focus-visible:ring-[#a35d70]/20"
            />
          </div>

          <Badge variant="outline" className="border-[#d8cfd3] bg-[#f9f7f6] text-[#716b70] px-3 py-1 text-xs rounded-full w-fit">
            {customers.length} total customers
          </Badge>
        </div>
      </div>

      <Card className="rounded-2xl border border-[#e8e3e5] bg-[#fffdfc] shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a35d70]"></div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12 text-[#716b70]">
              <User className="h-10 w-10 mx-auto text-[#b1a8ad] mb-3" />
              <p className="font-medium text-[#3f393e]">No customers found</p>
              <p className="text-xs text-[#9a9298] mt-1">
                {searchQuery ? 'Try matching a different customer name, phone, or city' : 'Customers will appear here when registered or after placing an order.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f8f5f3] border-b border-[#e8e3e5]">
                  <TableHead className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70] h-12 px-4">Customer</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70] h-12 px-4">Contact</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70] h-12 px-4">Location</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70] h-12 px-4">Orders</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70] h-12 px-4">Total Spent</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70] h-12 px-4">Joined / First Order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="border-b border-[#e8e3e5]/70 hover:bg-[#faf7f5]/70 transition-colors">
                    <TableCell className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-[#e8e3e5]">
                          <AvatarFallback className="bg-[#f5e6e8] text-[#a35d70] font-serif font-bold text-sm">
                            {customer.full_name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="text-[#242024] font-medium text-sm block">
                            {customer.full_name || 'Unnamed User'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <div className="space-y-1">
                        {customer.phone ? (
                          <div className="flex items-center gap-2 text-[#5f595d] text-xs font-mono">
                            <Phone className="h-3 w-3 text-[#9a9298]" />
                            {customer.phone}
                          </div>
                        ) : (
                          <span className="text-[#9a9298] text-xs">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      {customer.city ? (
                        <div className="flex items-center gap-1.5 text-[#5f595d] text-xs">
                          <MapPin className="h-3.5 w-3.5 text-[#9a9298]" />
                          {customer.city}
                        </div>
                      ) : (
                        <span className="text-[#9a9298] text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-[#3f393e]">
                        <Package className="h-3.5 w-3.5 text-[#a35d70]" />
                        <span className="font-semibold text-[#242024]">{customer.order_count || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-xs text-[#242024] font-semibold">
                      Rs. {customer.total_spent?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-xs text-[#716b70]">
                      {customer.created_at ? format(new Date(customer.created_at), 'MMM d, yyyy') : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomers;
