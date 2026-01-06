<template>
  <main class="page">
    <section class="section">
      <h1 class="title">Projects</h1>
      <div class="projects">
        <ProjectCard
          url="https://www.pianowithakira.com/"
          title="Akira's Online Piano Studio"
        >
          <picture>
            <source
              srcset="
                /images/pages/projects/screenshots/piano-with-akira/avif/piano-with-akira_400w_v1.avif  1x,
                /images/pages/projects/screenshots/piano-with-akira/avif/piano-with-akira_600w_v1.avif  1.5x,
                /images/pages/projects/screenshots/piano-with-akira/avif/piano-with-akira_800w_v1.avif  2x,
                /images/pages/projects/screenshots/piano-with-akira/avif/piano-with-akira_1200w_v1.avif 3x,
                /images/pages/projects/screenshots/piano-with-akira/avif/piano-with-akira_1600w_v1.avif 4x,
                /images/pages/projects/screenshots/piano-with-akira/avif/piano-with-akira_1440w_v1.avif
              "
              type="image/avif"
            />
            <source
              srcset="
                /images/pages/projects/screenshots/piano-with-akira/webp/piano-with-akira_400w_v1.webp  1x,
                /images/pages/projects/screenshots/piano-with-akira/webp/piano-with-akira_600w_v1.webp  1.5x,
                /images/pages/projects/screenshots/piano-with-akira/webp/piano-with-akira_800w_v1.webp  2x,
                /images/pages/projects/screenshots/piano-with-akira/webp/piano-with-akira_1200w_v1.webp 3x,
                /images/pages/projects/screenshots/piano-with-akira/webp/piano-with-akira_1600w_v1.webp 4x,
                /images/pages/projects/screenshots/piano-with-akira/webp/piano-with-akira_1440w_v1.webp
              "
              type="image/webp"
            />
            <img
              srcset="
                /images/pages/projects/screenshots/piano-with-akira/jpeg/piano-with-akira_400w_v1.jpeg  1x,
                /images/pages/projects/screenshots/piano-with-akira/jpeg/piano-with-akira_600w_v1.jpeg  1.5x,
                /images/pages/projects/screenshots/piano-with-akira/jpeg/piano-with-akira_800w_v1.jpeg  2x,
                /images/pages/projects/screenshots/piano-with-akira/jpeg/piano-with-akira_1200w_v1.jpeg 3x,
                /images/pages/projects/screenshots/piano-with-akira/jpeg/piano-with-akira_1600w_v1.jpeg 4x,
                /images/pages/projects/screenshots/piano-with-akira/jpeg/piano-with-akira_1440w_v1.jpeg
              "
              src="/images/pages/projects/screenshots/piano-with-akira/jpeg/piano-with-akira_1440w_v1.jpeg"
              alt="Open pianowithakira.com in a new tab"
            />
          </picture>
        </ProjectCard>
        <ProjectCard
          url="https://www.ikmstudio.com/"
          title="Ikegami Music Studio"
        >
          <picture>
            <source
              srcset="
                /images/pages/projects/screenshots/ikm-studio/avif/ikm-studio_400w_v1.avif  1x,
                /images/pages/projects/screenshots/ikm-studio/avif/ikm-studio_600w_v1.avif  1.5x,
                /images/pages/projects/screenshots/ikm-studio/avif/ikm-studio_800w_v1.avif  2x,
                /images/pages/projects/screenshots/ikm-studio/avif/ikm-studio_1200w_v1.avif 3x,
                /images/pages/projects/screenshots/ikm-studio/avif/ikm-studio_1600w_v1.avif 4x,
                /images/pages/projects/screenshots/ikm-studio/avif/ikm-studio_1440w_v1.avif
              "
              type="image/avif"
            />
            <source
              srcset="
                /images/pages/projects/screenshots/ikm-studio/webp/ikm-studio_400w_v1.webp  1x,
                /images/pages/projects/screenshots/ikm-studio/webp/ikm-studio_600w_v1.webp  1.5x,
                /images/pages/projects/screenshots/ikm-studio/webp/ikm-studio_800w_v1.webp  2x,
                /images/pages/projects/screenshots/ikm-studio/webp/ikm-studio_1200w_v1.webp 3x,
                /images/pages/projects/screenshots/ikm-studio/webp/ikm-studio_1600w_v1.webp 4x,
                /images/pages/projects/screenshots/ikm-studio/webp/ikm-studio_1440w_v1.webp
              "
              type="image/webp"
            />
            <img
              srcset="
                /images/pages/projects/screenshots/ikm-studio/jpeg/ikm-studio_400w_v1.jpeg  1x,
                /images/pages/projects/screenshots/ikm-studio/jpeg/ikm-studio_600w_v1.jpeg  1.5x,
                /images/pages/projects/screenshots/ikm-studio/jpeg/ikm-studio_800w_v1.jpeg  2x,
                /images/pages/projects/screenshots/ikm-studio/jpeg/ikm-studio_1200w_v1.jpeg 3x,
                /images/pages/projects/screenshots/ikm-studio/jpeg/ikm-studio_1600w_v1.jpeg 4x,
                /images/pages/projects/screenshots/ikm-studio/jpeg/ikm-studio_1440w_v1.jpeg
              "
              src="/images/pages/projects/screenshots/ikm-studio/jpeg/ikm-studio_1440w_v1.jpeg"
              alt="Open ikmstudio.com in a new tab"
            />
          </picture>
        </ProjectCard>
      </div>
    </section>
    <TheFooter />
  </main>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  padding: 30px 15px 0;
}

.section {
  margin: 0 auto 150px;
  max-width: 850px;
  padding-top: 35px;
  width: 100%;
}

.title {
  margin-bottom: 80px;
}

.projects {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

@media screen and (width >= 1000px) {
  .page {
    padding-top: 50px;
  }

  .projects {
    display: grid;
    gap: 50px;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
