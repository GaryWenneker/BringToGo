import EventBoard from '@/components/event-board';
import { defaultEvent } from '@/lib/model';
export default function Home() { return <EventBoard eventId={defaultEvent.id} />; }
