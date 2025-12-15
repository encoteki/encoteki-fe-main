import RevealText from '../RevealText'

interface SectionHeadingProps {
  title: string
  desc: string
  className?: string
  align?: 'left' | 'center' | 'right'
}

export default function SectionHeading({
  title,
  desc,
  className = '',
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div
      className={`space-y-6 md:space-y-8 lg:space-y-12 ${
        align === 'center'
          ? 'items-center text-center'
          : align === 'right'
            ? 'items-end text-right'
            : 'items-start text-left'
      } ${className}`}
    >
      <RevealText
        text={title}
        className="text-4xl leading-[0.9] font-bold md:text-6xl lg:text-8xl"
        delay={0}
        align={align}
        triggerType="scroll"
      />
      <RevealText
        text={desc}
        className="text-lg font-normal md:text-xl lg:text-3xl"
        delay={0.2}
        align={align}
        triggerType="scroll"
      />
    </div>
  )
}
