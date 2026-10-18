import EventBoard from '@/components/event-board';
export default async function EventPage({params}:{params:Promise<{eventId:string}>}) {
  return <EventBoard eventId={(await params).eventId} />;
}
