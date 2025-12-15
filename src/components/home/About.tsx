import SectionHeading from '@/ui/text/SectionHeading'

const visionMission = [
  {
    icon: '',
    title: 'Our vision',
    content: [
      {
        item: 'Develop a self-sustainable environment and community through technology.',
      },
    ],
  },
  {
    icon: '',
    title: 'Our mission',
    content: [
      {
        item: 'Conserve endangered Indonesian animals through real contribution.',
      },
      {
        item: 'Benefit environment, community, and holders through value-added initiatives.',
      },
    ],
  },
]

const paragraphs = [
  {
    paragraph:
      'ENCOTEKI is a combination of ‘EN’ (Environment), ‘CO’ (Community), and ‘TEKI’ (Teman Kita, meaning ‘our friend’ in Bahasa).',
  },
  {
    paragraph:
      'The name reflects our belief that both the environment and community are our friends, making them the core of ENCOTEKI.',
  },
  {
    paragraph:
      'We believe you as an individual and everyone on this planet can make a great impact on the environment and community. Together we can create impact for the things we do really care for.',
  },
]

const whitePaperUrl = process.env.WHITEPAPER_DRIVE_URL ?? ''

export default function About() {
  return (
    <section className="home-container bg-[#f7f3fa]">
      <SectionHeading title="About" desc="" />
    </section>
  )
}
