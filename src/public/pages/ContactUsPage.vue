<template>
  <div class="contact-us-page">
    <header-bar />
    <div class="main-content">
      <div class="contact-header">
        <h1>{{ $t('contact.title') }}</h1>
      </div>

      <div class="form-and-faq-container">
        <pv-card class="contact-card">
          <template #title>{{ $t('contact.formTitle') }}</template>
          <template #content>
            <div class="p-fluid">
              <div class="field">
                <label for="name">{{ $t('contact.nameLabel') }}</label>
                <pv-input-text id="name" v-model="form.name" :placeholder="$t('contact.namePlaceholder')" />
              </div>
              <div class="field">
                <label for="email">{{ $t('contact.emailLabel') }}</label>
                <pv-input-text id="email" v-model="form.email" :placeholder="$t('contact.emailPlaceholder')" />
              </div>
              <div class="field">
                <label for="subject">{{ $t('contact.subjectLabel') }}</label>
                <pv-input-text id="subject" v-model="form.subject" :placeholder="$t('contact.subjectPlaceholder')" />
              </div>
              <div class="field">
                <label for="message">{{ $t('contact.messageLabel') }}</label>
                <Textarea id="message" v-model="form.message" rows="5" :placeholder="$t('contact.messagePlaceholder')" />
              </div>
              <div class="field">
                <label>{{ $t('contact.attachLabel') }}</label>
                <FileUpload mode="advanced" name="demo[]" url="./upload" accept="image/*" :maxFileSize="1000000" :showUploadButton="false" :showCancelButton="false" :chooseLabel="$t('contact.attachButton')" />
              </div>
              <pv-button :label="$t('contact.sendButton')" class="send-button" @click="submitForm" />
            </div>
          </template>
        </pv-card>

        <div class="contact-info-section">
          <div class="contact-info-grid">
            <div class="info-card">
              <i class="pi pi-envelope"></i>
              <h3>{{ $t('contact.contactInfo.email') }}</h3>
              <p>{{ $t('contact.contactInfo.emailAddress') }}</p>
            </div>
            <div class="info-card">
              <i class="pi pi-whatsapp"></i>
              <h3>{{ $t('contact.contactInfo.whatsapp') }}</h3>
              <p>+51 991 929 586</p>
            </div>
            <div class="info-card">
              <i class="pi pi-linkedin"></i>
              <h3>{{ $t('contact.contactInfo.linkedin') }}</h3>
              <p>{{ $t('contact.contactInfo.linkedinText') }}</p>
            </div>
            <div class="info-card">
              <i class="pi pi-map-marker"></i>
              <h3>{{ $t('contact.contactInfo.location') }}</h3>
              <p>{{ $t('contact.contactInfo.locationText') }}</p>
            </div>
          </div>
          <p class="horario">{{ $t('contact.contactInfo.schedule') }}</p>
        </div>

        <div class="faq-section">
          <h2>{{ $t('contact.faqTitle') }}</h2>
          <Accordion :activeIndex="0">
            <AccordionTab v-for="(item, index) in faqItems" :key="index" :header="item.q">
              <p>{{ item.a }}</p>
            </AccordionTab>
          </Accordion>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import HeaderBar from '../components/headerBar.vue';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

const { locale, tm, t } = useI18n();

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const faqItems = computed(() => {
  return tm('contact.faq') || [];
});

function submitForm() {
  const { name, email, subject, message } = form.value;
  if (!name || !email || !subject || !message) {
    alert(t('contact.validation.required'));
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert(t('contact.validation.invalidEmail'));
    return;
  }

  console.log('Form data:', form.value);
  alert(t('contact.validation.success'));

  form.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
}
</script>

<style scoped>
.contact-us-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f5f2; /* Light creamy background */
}

.main-content {
  flex-grow: 1;
  padding: 90px 2rem 2rem;
  overflow-y: auto;
}

.contact-header {
  text-align: center;
  margin-bottom: 2rem;
}

.contact-header h1 {
  font-size: 1.75rem;
  color: #4b3f35; 
}

.form-and-faq-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.contact-card {
  flex: 1;
  max-width: 800px;
  width: 100%;
  background-color: #d7c9b9; 
  border: none;
  border-radius: 8px;
}

::v-deep .contact-card .p-card-body {
  padding: 0;
}

::v-deep .contact-card .p-card-title {
  padding: 1.5rem;
}

::v-deep .contact-card .p-card-content {
    background-color: #ffffff;
    padding: 2rem;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}

::v-deep .contact-card .p-inputtext,
::v-deep .contact-card .p-textarea {
    width: 100%;
}

::v-deep .p-fileupload .p-button {
    background: #e9ecef;
    color: #495057;
    border: 1px solid #ced4da;
}

::v-deep .p-fileupload .p-button:hover {
    background: #d1d5db;
}

.field {
  margin-bottom: 1.5rem;
}

.field > label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.send-button {
  width: 100%;
  background-color: #000000;
  color: #ffffff;
  border: none;
  padding: 1rem;
  font-size: 1rem;
}

.contact-info-section {
    width: 100%;
    max-width: 1224px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin: 1rem 0;
}

.contact-info-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    width: 100%;
}

.info-card {
    background-color: #5e776d;
    color: white;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.info-card i {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.info-card h3 {
    font-size: 1.1rem;
    font-weight: bold;
    margin: 0.5rem 0 0.25rem;
}

.info-card p {
    font-size: 0.9rem;
    margin: 0;
}

.horario {
    font-size: 0.9rem;
    color: #4b3f35;
    text-align: center;
    margin-top: 1rem;
}

.faq-section {
  flex: 1;
  max-width: 600px;
}

.faq-section h2 {
    text-align: center;
    font-size: 1.5rem;
    color: #4b3f35;
    margin-bottom: 1rem;
}

.p-accordion-header-link {
    background-color: #ffffff;
    border: 1px solid #ddd;
}

.p-accordion-content {
    background-color: #fafafa;
}

@media (max-width: 992px) {
    .contact-info-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 576px) {
    .contact-info-grid {
        grid-template-columns: 1fr;
    }
}
</style> 