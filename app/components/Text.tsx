import { ReactNode } from "react";
import { TextVariant, TextSize, HeadingLevel } from "../enums";

interface TextProps {
  children: ReactNode;
  variant?: TextVariant;
  size?: TextSize;
  className?: string;
  bold?: boolean;
  as?: HeadingLevel;
}
const getVariantClasses = (variant: TextVariant) => {
  switch (variant) {
    case TextVariant.PRIMARY:
      return "text-white-600";
    case TextVariant.SECONDARY:
      return "text-gray-800";
    case TextVariant.SUCCESS:
      return "text-green-600";
    case TextVariant.DANGER:
      return "text-red-600";
    case TextVariant.INFO:
      return "text-blue-600";
    default:
      return "text-blue-800";
  }
};

const getSizeClasses = (size: TextSize) => {
  switch (size) {
    case TextSize.XS:
      return "text-xs";
    case TextSize.SM:
      return "text-sm";
    case TextSize.BASE:
      return "text-base";
    case TextSize.LG:
      return "text-lg";
    case TextSize.XL:
      return "text-xl";
    case TextSize.XXL:
      return "text-2xl";
    case TextSize.XXXL:
      return "text-3xl";
    case TextSize.XXXXL:
      return "text-4xl";
    default:
      return "text-base";
  }
};

const getDefaultSizeForHeading = (as: HeadingLevel): TextSize => {
  switch (as) {
    case HeadingLevel.H1:
      return TextSize.XXXXL;
    case HeadingLevel.H2:
      return TextSize.XXXL;
    case HeadingLevel.H3:
      return TextSize.XXL;
    case HeadingLevel.H4:
      return TextSize.XL;
    case HeadingLevel.H5:
      return TextSize.LG;
    case HeadingLevel.H6:
      return TextSize.BASE;
    default:
      return TextSize.BASE;
  }
};

export default function Text({
  children,
  variant = TextVariant.PRIMARY,
  size,
  className = "",
  bold = false,
  as = HeadingLevel.P,
  ...props
}: TextProps) {
  const Component = as;
  const defaultSize = size || getDefaultSizeForHeading(as);
  const isHeading = as !== HeadingLevel.P && as !== HeadingLevel.SPAN;

  return (
    <Component
      className={`
        ${getVariantClasses(variant)}
        ${getSizeClasses(defaultSize)}
        ${bold || isHeading ? "font-bold" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
}
