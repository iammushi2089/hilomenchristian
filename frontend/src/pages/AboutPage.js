// frontend/src/pages/AboutPage.js
import '../global.css';

const AboutPage = () => {
  return (
    <main className="container">
      {/* Hero Section */}
      <section className="hero fade-in" style={{
        background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/LaSalle.jpg') center/cover no-repeat"
      }}>
        <h1>Know more about the <span style={{ color: 'yellow' }}>Website and Developer</span>.</h1>
        <p>Here is a more detailed look at the website and its creator.</p>
      </section>

      {/* About Section with Developer Profile */}
        <h2>About the Developer and Website</h2>
        
        {/* Developer Profile Card */}
        <div className="developer-profile">
          <div className="developer-image">
            <img 
              src="/assets/developer.jpg" 
              alt="Christian Hilomen - Developer"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x300?text=Developer+Photo';
                e.target.onerror = null;
              }}
            />
          </div>
          
          <div className="developer-info">
            <h3>Christian Hilomen</h3>
            <p className="developer-title">3rd Year Computer Science Student</p>
            <p className="developer-school">Don Mariano Marcos Memorial State University</p>
            
            <div className="developer-bio">
              <p>
                Christian is a passionate full-stack developer with a keen interest in building 
                modern web applications. This sports blogging platform is a portfolio project 
                that demonstrates his skills in the MERN stack (MongoDB, Express.js, React, Node.js).
              </p>
              <br />
              <p>
                The platform showcases user authentication, role-based access control, file uploads,
                real-time interactions, and responsive design principles.
              </p>
            </div>
          </div>
        </div>

        {/* Website Description */}
        <div className="website-info">
          <h3>About This Platform</h3>
          <p>
            This website is a social blogging platform where registered users can create,
            view, heart, and comment on posts. It demonstrates full-stack functionality
            with user authentication, role-based access, file uploads, and real-time
            interactions.
          </p>
        </div>

      {/* Skills/Technologies Section */}
      <section>
        <br />
        <br />
        <br />
        <h2>Technologies Used</h2>
        <div className="highlights-grid">
          <article className="card fade-in">
            <div className="card-content">
              <h3>Frontend</h3>
              <ul className="tech-list">
                <li>React.js</li>
                <li>React Router</li>
                <li>Axios</li>
                <li>CSS3 with Dark Mode</li>
              </ul>
            </div>
          </article>

          <article className="card fade-in">
            <div className="card-content">
              <h3>Backend</h3>
              <ul className="tech-list">
                <li>Node.js</li>
                <li>Express.js</li>
                <li>JWT Authentication</li>
                <li>Multer (File Uploads)</li>
              </ul>
            </div>
          </article>

          <article className="card fade-in">
            <div className="card-content">
              <h3>Database & Tools</h3>
              <ul className="tech-list">
                <li>MongoDB</li>
                <li>Mongoose ODM</li>
                <li>Git & GitHub</li>
                <li>RESTful APIs</li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      {/* What I love about sports */}
      <section id="passion">
        <h2>What I Love About Sports</h2>
        <div className="highlights-grid">
          <div className="card">
            <img src="/assets/F2disbandedteam.jpg" alt="F2 Logistics" loading="lazy" />
            <div className="card-content">
              <h3>The Spirit of Teamwork</h3>
              <p>Nothing compares to the feeling of working together with teammates toward a common goal. The coordination, trust, and shared victories create bonds that last a lifetime.</p>
            </div>
          </div>
          <div className="card">
            <img src="/assets/ranpogi.jpg" alt="Ran receiving" loading="lazy" />
            <div className="card-content">
              <h3>Mental & Physical Challenge</h3>
              <p>Sports push you beyond your limits, teaching resilience and determination. The constant challenge to improve both body and mind is incredibly rewarding.</p>
            </div>
          </div>
        </div>
      </section>

      {/* My Sports Journey */}
      <section className="section" id="journey">
        <h2>My Sports Journey Timeline</h2>
        <ol className="timeline-list">
          <li><strong>Early Childhood (Ages 5-10):</strong> Started with playing pass the ball with my brother. Learned basic coordination and teamwork skills.</li>
          <li><strong>Middle School (Ages 11-14):</strong> Did try out for elementary volleyball team. Unfortunately, I didn't get into the team.</li>
          <li><strong>High School (Ages 15-18):</strong> Became an avid fan of volleyball. Idolized Maddie Madayag of Ateneo Lady Eagles.</li>
          <li><strong>College (Ages 19-22):</strong> Supporter of PVL Tournament's Team Choco Mucho Flying Titans. Still a "Madzilla" fan.</li>
          <li><strong>Present Day:</strong> Still love the sport but no longer interested in trying to play.</li>
        </ol>
      </section>

      {/* Sports Quote */}
      <section>
        <h2>Inspiring Volleyball Veterans Wisdom</h2>
        <blockquote>
          "Sa lahat ng laban, tiwala ako na kaya ko."
          <a href="https://women.volleybox.net/alyssa-valdez-p4965" target="_blank" rel="noopener noreferrer">
            <img src="/assets/AlyssaValdez.jpg" alt="Creamline" loading="lazy" />
          </a>
          <br />
          — Alyssa Valdez, The Phenom
          <h6>(Click the image for more info.)</h6>
        </blockquote>
        <blockquote>
          "Alas Men won't be remembered for how it ended, but for how much we fought."
          <a href="https://volleybox.net/bryan-bagunas-p33752" target="_blank" rel="noopener noreferrer">
            <img src="/assets/BryanBagunas.jpg" alt="Cignal" loading="lazy" />
          </a>
          <br />
          — Bryan Bagunas, The Bazooka
          <h6>(Click the image for more info.)</h6>
        </blockquote>
      </section>

      {/* Sports Categories */}
      <section className="section" id="team-sports">
        <h2>Team Sports I've Experienced</h2>
        <div className="highlights-grid">
          <div className="card">
            <img src="/assets/ChineseGarter.jpg" alt="Baklang Naglalaro" loading="lazy" />
            <div className="card-content">
              <h3>Chinese Garter</h3>
              <p>Played as 'mother' for my whole life. Love the saving my 'anak' and giving swaggy and sassy attitude to my opponents.</p>
            </div>
          </div>
          <div className="card">
            <img src="/assets/AgawanBase.jpg" alt="Agawan ng mga Bading" loading="lazy" />
            <div className="card-content">
              <h3>Agawan ng Base (Base2Base)</h3>
              <p>Never experienced any defeat since I'm a very fast runner before (before lang).</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;