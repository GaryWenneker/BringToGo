import EventBoard from '@/components/event-board';
import { notFound } from 'next/navigation';
import { defaultEvent } from '@/lib/model';

export default async function EventPage({ params }: { params: Promise<{eventId: string}> }) {
  const { eventId } = await params;
  if (eventId !== defaultEvent.id) notFound();
  // Old invitation URLs keep working, but no other events can be displayed.
  return <EventBoard eventId={defaultEvent.id} />;
}
