import Reveal from '../Reveal';
import './OurStory.css';

export default function OurStory() {
  return (
    <section className="story section-pad">
      <div className="container">
        <div className="story__head">
          <Reveal><span className="eyebrow">Our Story</span></Reveal>
          <Reveal delay={0.08} as="h2" className="story__title">
            Why ACHL Was Created
          </Reveal>
          <Reveal delay={0.16} as="p" className="story__desc">
            Every successful company invests heavily in technology. But the biggest competitive
            advantage has never been technology. It has always been the quality of human thinking.
          </Reveal>
        </div>

        <div className="story__grid">
          <Reveal className="story__problem">
            <h3>The Problem</h3>
            <p>
              Universities produce graduates with knowledge, yet many struggle when faced with real
              business problems, uncertainty and decision-making.
            </p>
            <p>
              Recruiters today expect much more than academic scores. They want professionals who
              can analyse information, solve problems, communicate effectively and make confident
              decisions.
            </p>
            <p>This gap between education and industry inspired the creation of ACHL.</p>
          </Reveal>

          <div className="story__cards">
            <Reveal delay={0.1} className="story__card">
              <h4>Education</h4>
              <p>Focuses on knowledge.</p>
            </Reveal>
            <Reveal delay={0.2} className="story__card">
              <h4>Industry</h4>
              <p>Demands judgement and decision making.</p>
            </Reveal>
            <Reveal delay={0.3} className="story__card story__card--highlight">
              <h4>ACHL</h4>
              <p>Bridges the gap through practical thinking.</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
