import flutter from '@/assets/stackIcons/Flutter-Light.svg';
import figma from '@/assets/stackIcons/Figma.svg';
import spring from '@/assets/stackIcons/Spring-Light.svg';

export function getStackImage(stack: string) {
  switch (stack) {
    case 'FLUTTER':
      return flutter;
    case 'FIGMA':
      return figma;
    case 'SPRING':
      return spring;
    default:
      return null;
  }
}
