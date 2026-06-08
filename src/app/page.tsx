import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { Beliefs } from "@/components/sections/Beliefs";
import { Capabilities } from "@/components/sections/Capabilities";
import { OperatorStack } from "@/components/sections/OperatorStack";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Process } from "@/components/sections/Process";
import { AISection } from "@/components/sections/AISection";
import { Testimonials } from "@/components/sections/Testimonials";
import { Lab } from "@/components/sections/Lab";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      {/* Hero — full-screen, client-side animated */}
      <Hero />

      {/* Story — "Evolution of a Product Builder" RPG journey */}
      <Story />

      {/* Beliefs — "My Operating System" philosophy deck */}
      <Beliefs />

      {/* Capabilities — "Builder Skill Tree" */}
      <Capabilities />

      {/* Operator Stack — "System Architecture" signal cascade */}
      <OperatorStack />

      {/* Work — tabbed by category */}
      <SelectedWork />

      {/* Process — "Build Log" founder journal deck */}
      <Process />

      {/* AI — "AI Operations" command center */}
      <AISection />

      {/* Testimonials — "Signals From The Field" reputation map */}
      <Testimonials />

      {/* Lab — "Rahul's Open Tabs" */}
      <Lab />

      {/* Contact — "Let's build something worth it." */}
      <Contact />
    </>
  );
}
