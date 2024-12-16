
import NavBar from '@/components/UserComponent/NavBar/NavBar'
import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, CreditCard } from 'lucide-react'
import SideBar from '@/components/UserComponent/SideBar/SideBar'


const Orders = () => {

  const orders = [
    {
      id: 'ORD-001',
      date: '2023-06-15',
      status: 'Delivered',
      total: 129.97,
      paymentMethod: 'Visa •••• 4242',
      items: [
        { id: 'PROD-1', name: 'Premium T-Shirt', image: '/placeholder.svg?height=80&width=80' },
        { id: 'PROD-2', name: 'Wireless Earbuds', image: '/placeholder.svg?height=80&width=80' },
      ],
    },
    {
      id: 'ORD-002',
      date: '2023-06-20',
      status: 'Shipped',
      total: 89.99,
      paymentMethod: 'PayPal',
      items: [
        { id: 'PROD-3', name: 'Smartwatch', image: '/placeholder.svg?height=80&width=80' },
      ],
    },
    {
      id: 'ORD-003',
      date: '2023-06-25',
      status: 'Processing',
      total: 159.95,
      paymentMethod: 'Apple Pay',
      items: [
        { id: 'PROD-4', name: 'Phone Case', image: '/placeholder.svg?height=80&width=80' },
        { id: 'PROD-5', name: 'Screen Protector', image: '/placeholder.svg?height=80&width=80' },
        { id: 'PROD-6', name: 'Portable Charger', image: '/placeholder.svg?height=80&width=80' },
        { id: 'PROD-7', name: 'Bluetooth Speaker', image: '/placeholder.svg?height=80&width=80' },
      ],
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-yellow-500'
      case 'Shipped': return 'bg-blue-500'
      case 'Delivered': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }


  return (
    <div className='md:ps-[340px] ps-5  pt-32'>
    <NavBar/>
    <SideBar current="order"/>
    <div className="min-h-screen pe-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        <div className="space-y-6  ">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">{order.id}</h2>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} text-white`}>{order.status}</Badge>
                </div>
                <div className="flex items-center mb-4">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={item.id} className={`relative rounded-full overflow-hidden border-2 border-white w-16 h-16 ${index !== 0 ? '-ml-4' : ''}`} style={{zIndex: 3 - index}}>
                      <img
                        src={item.image}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="relative -ml-4 rounded-full bg-gray-200 w-16 h-16 flex items-center justify-center text-gray-600 font-semibold" style={{zIndex: 0}}>
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span>{order.paymentMethod}</span>
                  </div>
                  <div className="font-semibold">
                    Total: ${order.total.toFixed(2)}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <Truck className="w-4 h-4" />
                  <span>Estimated delivery: 3-5 business days</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}

export default Orders
