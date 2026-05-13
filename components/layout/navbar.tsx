"use client";
import { CircleMenu } from "@/components/ui/circle-menu";
import { SocialIsland } from "@/components/ui/social-island";
import { SOCIAL_LINKS } from "@/components/ui/social-island";
import { ThemeToggler } from "@/components/ui/theme-toggler";
import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import { INTRO_DONE_MS } from "@/components/ui/intro-loader";

// Items expand in a 90° arc from UP → LEFT (upper-left quadrant)
const FAB_START_ANGLE = -Math.PI / 2;
const FAB_ARC = -Math.PI / 2;

export function Navbar() {
  const mobileItems = [
    {
      label: "GitHub",
      icon: <SiGithub size={16} />,
      href: SOCIAL_LINKS.find((s) => s.id === "github")?.href ?? "#",
    },
    {
      label: "LinkedIn",
      icon: <FaLinkedinIn size={16} />,
      href: SOCIAL_LINKS.find((s) => s.id === "linkedin")?.href ?? "#",
    },
    {
      label: "Email",
      icon: <Mail size={16} />,
      href: SOCIAL_LINKS.find((s) => s.id === "email")?.href ?? "#",
    },
    {
      label: "Tema",
      icon: (
        <span className="flex scale-[0.88] items-center justify-center">
          <ThemeToggler />
        </span>
      ),
      embedInteractive: true,
    },
  ];

  return (
    <>
      {/* Desktop: social island at bottom center (hidden on mobile) */}
      <SocialIsland className="hidden md:block" />

      {/*
        Mobile FAB — bottom-right corner.
        Container is 250×250 with trigger at center (125px from each edge).
        To place trigger at right:32px / bottom:32px:
          right: -(125 - 32) = -93px  |  bottom: -(125 - 32) = -93px
        Items arc UP → LEFT so they stay visible.
      */}
      <motion.div
        className="fixed z-50 md:hidden"
        style={{ right: -93, bottom: -93 }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: INTRO_DONE_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
      >
        <CircleMenu
          items={mobileItems}
          startAngle={FAB_START_ANGLE}
          arc={FAB_ARC}
        />
      </motion.div>
    </>
  );
}
