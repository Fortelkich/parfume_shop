import { SiteShell } from "@/components/site-shell";
import { ServiceOrderForm } from "@/components/service-order-form";

export default function SampleSetPage() {
  return (
    <SiteShell>
      <div className="py-10">
        <ServiceOrderForm
          type="SAMPLE_SET"
          title="Набор пробников"
          hint="Уточните любимые бренды или ноты, мы соберем сет." 
        />
      </div>
    </SiteShell>
  );
}
