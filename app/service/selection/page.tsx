import { SiteShell } from "@/components/site-shell";
import { ServiceOrderForm } from "@/components/service-order-form";

export default function SelectionPage() {
  return (
    <SiteShell>
      <div className="py-10">
        <ServiceOrderForm
          type="SELECTION_SERVICE"
          title="Подбор аромата"
          hint="Расскажите о настроении, любимых нотах и ситуации." 
        />
      </div>
    </SiteShell>
  );
}
