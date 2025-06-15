import { FaCheck, FaRegClock, FaThumbsUp, FaTruck, FaWrench } from "react-icons/fa";
import { ORDER_STATUS_LIST as orderStatusList } from "../types/constants";

type TimelineStatus = 'processing' | 'production' | 'shipping' | 'delivered';
const TIMELINE_DAYS: Record<TimelineStatus, number> = { processing: 2, production: 7, shipping: 14, delivered: 21 };

export function getStatusSteps(status: (typeof orderStatusList)[number], daysSinceOrder: number) {
  const currentIndex = orderStatusList.indexOf(status);

  const isCompleted = (stepStatus: string, index: number) => {
    return currentIndex >= index || daysSinceOrder > (TIMELINE_DAYS[stepStatus as TimelineStatus] || 0);
  };
  const getDescription = (stepStatus: string, completed: boolean) => {
    const descriptions: Record<string, string> = {
      received: 'Your order has been received and confirmed.',
      processing: 'Your order will be processed and prepared for production.',
      production: 'Your vehicle will be manufactured according to your configuration.',
      shipping: 'Your vehicle will be shipped to your selected dealership.',
      delivered: completed
        ? 'Your vehicle has been delivered and is ready for pickup.'
        : 'Your vehicle will be delivered to your selected dealership.'
    };
    return descriptions[stepStatus];
  };

  return [
    {
      label: 'Order Received',
      completed: true,
      icon: <FaCheck />,
      description: getDescription('received', true)
    },
    {
      label: 'Processing',
      completed: isCompleted('processing', 1),
      icon: <FaRegClock />,
      description: getDescription('processing', isCompleted('processing', 1))
    },
    {
      label: 'Production',
      completed: isCompleted('production', 2),
      icon: <FaWrench />,
      description: getDescription('production', isCompleted('production', 2))
    },
    {
      label: 'Shipping',
      completed: isCompleted('shipping', 3),
      icon: <FaTruck />,
      description: getDescription('shipping', isCompleted('shipping', 3))
    },
    {
      label: 'Delivered',
      completed: isCompleted('delivered', 4),
      icon: <FaThumbsUp />,
      description: getDescription('delivered', isCompleted('delivered', 4))
    }
  ];
}