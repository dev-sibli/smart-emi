import { MerchantHeader } from "@/components/merchant/merchant-header"
import { StoreProfile } from "@/components/merchant/store-profile"

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <MerchantHeader title="Store Profile" />
      <StoreProfile />
    </div>
  )
}
