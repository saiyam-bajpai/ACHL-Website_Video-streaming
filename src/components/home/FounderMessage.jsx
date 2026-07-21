import Reveal from '../Reveal';
import ImageSlot from '../ImageSlot';
import './FounderMessage.css';

export default function FounderMessage() {
  return (
    <section className="founder section-pad">
      <div className="container founder__grid">
        <Reveal className="founder__image-wrap" as="div">
          <ImageSlot
            src="/images/founder.jpg"
            alt="Founder of ACHL"
            label="Founder photo — add /images/founder.jpg"
            className="founder__image"
            ratio="4 / 5"
          />
        </Reveal>

        <div className="founder__content">
          <Reveal delay={0.05}>
            <span className="eyebrow">Founder's Message</span>
          </Reveal>
          <Reveal delay={0.12} as="h2" className="founder__title">
            The Future Belongs To Thinkers.
          </Reveal>
          <Reveal delay={0.2} as="p" className="founder__p">
            When I looked around, I realised students were graduating with degrees but struggling
            to solve practical business problems. At the same time, Artificial Intelligence was
            changing the nature of work faster than education could adapt.
          </Reveal>
          <Reveal delay={0.28} as="p" className="founder__p">
            ACHL was created with a simple mission — to help people become irreplaceable by
            developing the one capability machines cannot replicate: independent thinking.
          </Reveal>
          <Reveal delay={0.36} className="founder__quote">
            <p>"Knowledge may open doors, but the ability to think determines how far you go."</p>
          </Reveal>
          <Reveal delay={0.42} as="p" className="founder__sign">
            — Founder, ACHL
          </Reveal>
        </div>
      </div>
    </section>
  );
}
