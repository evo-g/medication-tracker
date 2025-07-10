import MedsClient from './MedsClient';

type Props = {
  params: { date: string };
};

export default function MedsByDatePage({ params }: Props) {
  const { date } = params;
  return <MedsClient date={date} />;
}
