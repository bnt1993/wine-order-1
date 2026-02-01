import { supabase } from "./supabase"

export async function createOrder(order: {
  customer: any
  items: any[]
  total_price: number
  payment_method: string
  status: string
}) {
  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        customer: order.customer,
        items: order.items,
        total_price: order.total_price,
        payment_method: order.payment_method,
        status: order.status
      }
    ])

  if (error) {
    console.error("Lỗi lưu đơn:", error)
    throw error
  }

  return data
}
