import Search from "@/components/shared/Search"
import { getOrdersByEvent } from "@/lib/server_actions/order.actions"
import { formatDateTime, formatPrice } from "@/lib/utils"
import { OrderItem } from "@/types"

const Orders = async (
  {searchParams}: 
  {searchParams: Record<string, string>}
) => {
  const eventId = searchParams?.eventId || ''
  const searchText = searchParams?.search || ''

  const orders = await getOrdersByEvent({ eventId, searchString: searchText })

  return (
    <div className="w-full flex flex-col gap-4 p-4 h-full">
      <section className="w-full flex md:justify-center">
        <h3 className="text-4xl font-semibold">Orders</h3>
      </section>

      <section className="mt-8">
        <Search placeholder="Search buyer name..." />
      </section>

      <section className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-grey-500">
              <th className="min-w-[250px] py-3 text-left">Order ID</th>
              <th className="min-w-[200px] flex-1 py-3 pr-4 text-left">Event Title</th>
              <th className="min-w-[150px] py-3 text-left">Buyer</th>
              <th className="min-w-[100px] py-3 text-left">Created</th>
              <th className="min-w-[100px] py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              <>
                {orders &&
                  orders.map((row: OrderItem) => (
                    <tr
                      key={row._id}
                      style={{ boxSizing: 'border-box' }}>
                      <td className="min-w-[250px] py-4 text-primary-500">{row._id}</td>
                      <td className="min-w-[200px] flex-1 py-4 pr-4">{row.eventTitle}</td>
                      <td className="min-w-[150px] py-4">{row.buyer}</td>
                      <td className="min-w-[100px] py-4">
                        {formatDateTime(row.createdAt).dateTime}
                      </td>
                      <td className="min-w-[100px] py-4 text-right">
                        {formatPrice(row.totalAmount)}
                      </td>
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default Orders