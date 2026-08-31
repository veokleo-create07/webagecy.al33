"use client";
import { useLanguage } from "@/components/language-provider";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { BookingLink } from "@/components/booking/booking-provider";

const services = [
  "Strategy & Design",
  "Web Development",
  "Marketing & SEO",
  "Software Systems",
] as const;

export function Services() {
  const { t } = useLanguage();
  return (
    <section className="services" id="expertise" aria-labelledby="services-title">
      <div className="services__pin">
        <header className="services__header">
          <h2 id="services-title">{t("From strategy to growth")}</h2>
          <p>
            {t("We connect design, development and digital visibility into one system built to move your business forward.")}
          </p>
          <BookingLink className="services__cta">
            <span>{t("Book a discovery call")}</span>
            <span aria-hidden="true"><ArrowIcon /></span>
          </BookingLink>
        </header>

        <div className="workflow" aria-label={t("Connected services workflow")}>
          {services.map((service, index) => (
            <div className="workflow__step" key={service}>
              <div className="workflow-node" data-workflow-node>
                <i aria-hidden="true" />
                <h3>{t(service)}</h3>
              </div>
              <div className="workflow-connector" data-workflow-connector aria-hidden="true">
                <span />
              </div>
              {index === services.length - 1 && (
                <div className="workflow-node workflow-node--outcome" data-workflow-node>
                  <i aria-hidden="true" />
                  <p>{t("Stronger digital presence")}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
