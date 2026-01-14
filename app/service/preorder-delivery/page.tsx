import { SiteShell } from "@/components/site-shell";
import { ServiceOrderForm } from "@/components/service-order-form";

export default function PreorderDeliveryPage() {
  return (
    <SiteShell>
      <div className="py-10">
        <ServiceOrderForm
          type="PREORDER_DELIVERY"
          title="Заказ под привоз"
          hint="Опишите аромат или бренд, и мы уточним сроки поставки."
        />
      </div>
    </SiteShell>
  );
}
