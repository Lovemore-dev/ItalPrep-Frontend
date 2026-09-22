<template>
  <main class="admin-panel">
    <h1>Manage terms</h1>
    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>

    <form class="editor" @submit.prevent="saveModule">
      <h2>{{ editingSlug ? "Update module" : "Create module" }}</h2>
      <label>Title
        <select v-model="titleSelection" required>
          <option value="" disabled>Select a module title</option>
          <option value="__new__">Create a new module</option>
          <option v-for="module in modules" :key="module._id" :value="module.title">{{ module.title }}</option>
        </select>
      </label>
      <label v-if="titleSelection === '__new__'">New title <input v-model="form.title" required /></label>
      <label>Slug <input :value="form.slug" readonly aria-readonly="true" /></label>
      <label>Category
        <select v-model="form.category" required>
          <option v-for="category in categories" :key="category">{{ category }}</option>
        </select>
      </label>
      <label>Description <textarea v-model="form.description" /></label>
      <div v-for="(item, index) in form.items" :key="index" class="term-editor">
        <input v-model="item.label_it" placeholder="Italian term" required />
        <input v-model="item.label_en" placeholder="English translation" required />
        <input v-model="item.extra_info" placeholder="Extra information" />
        <button type="button" @click="removeItem(index)">Remove</button>
      </div>
      <button type="button" @click="addItem">Add term</button>
      <button type="submit">{{ editingSlug ? "Save changes" : "Create module" }}</button>
      <button v-if="editingSlug" type="button" @click="resetForm">Cancel</button>
    </form>

    <section>
      <h2>Existing modules</h2>
      <ul class="module-list">
        <li v-for="module in modules" :key="module._id">
          <span>{{ module.title }} ({{ module.category }})</span>
          <span><button @click="editModule(module)">Edit</button><button @click="removeModule(module)">Delete</button></span>
        </li>
      </ul>
    </section>

    <form class="editor" @submit.prevent="createAdmin">
      <h2>Create another admin</h2>
      <label>Full name <input v-model="newAdmin.fullname" required /></label>
      <label>Username <input v-model="newAdmin.username" required pattern="[a-zA-Z0-9]+" /></label>
      <label>Password <input v-model="newAdmin.password" type="password" minlength="6" required /></label>
      <button type="submit">Create admin account</button>
    </form>

    <section v-if="pendingTestimonials.length">
      <h2>Pending learner stories</h2>
      <ul class="module-list">
        <li v-for="testimonial in pendingTestimonials" :key="testimonial._id">
          <span>“{{ testimonial.quote }}” — {{ testimonial.user.fullname }} ({{ testimonial.user.proficiency }})</span>
          <button @click="approveTestimonial(testimonial._id)">Approve</button>
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import api from "../services/api";

const categories = ["linguistic", "civic", "safety", "logical", "methodology", "hardware", "architecture", "database"];
const modules = ref([]);
const editingSlug = ref("");
const titleSelection = ref("");
const message = ref("");
const error = ref("");
const form = reactive({ title: "", slug: "", category: categories[0], description: "", items: [] });
const newAdmin = reactive({ fullname: "", username: "", password: "" });
const pendingTestimonials = ref([]);

const resetForm = () => {
  editingSlug.value = "";
  titleSelection.value = "__new__";
  Object.assign(form, { title: "", slug: "", category: categories[0], description: "", items: [] });
};
const toSlug = (title) => title
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");
const addItem = () => form.items.push({ label_it: "", label_en: "", extra_info: "" });
const removeItem = (index) => form.items.splice(index, 1);
const loadModules = async () => { modules.value = (await api.getModules()).data; };
const selectModule = async (title) => {
  if (title === "__new__") {
    resetForm();
    return;
  }
  const module = modules.value.find((candidate) => candidate.title === title);
  if (module) await editModule(module);
};
const editModule = async (module) => {
  const { data } = await api.getModuleDetails(module.slug);
  Object.assign(form, JSON.parse(JSON.stringify(data)));
  editingSlug.value = module.slug;
  titleSelection.value = module.title;
};
const saveModule = async () => {
  try {
    editingSlug.value ? await api.updateModule(editingSlug.value, form) : await api.createModule(form);
    message.value = "Module saved";
    error.value = "";
    resetForm();
    await loadModules();
  } catch (err) { error.value = err.response?.data?.message || "Unable to save module"; }
};
const removeModule = async (module) => {
  if (!window.confirm(`Delete ${module.title}?`)) return;
  try { await api.deleteModule(module.slug); message.value = "Module deleted"; await loadModules(); }
  catch (err) { error.value = err.response?.data?.message || "Unable to delete module"; }
};
const createAdmin = async () => {
  try { await api.createAdmin(newAdmin); message.value = "Admin account created"; Object.assign(newAdmin, { fullname: "", username: "", password: "" }); }
  catch (err) { error.value = err.response?.data?.message || "Unable to create admin"; }
};
const loadPendingTestimonials = async () => {
  try { pendingTestimonials.value = (await api.getPendingTestimonials()).data; }
  catch (err) { error.value = err.response?.data?.message || "Unable to load learner stories"; }
};
const approveTestimonial = async (id) => {
  try {
    await api.approveTestimonial(id);
    pendingTestimonials.value = pendingTestimonials.value.filter((testimonial) => testimonial._id !== id);
    message.value = "Learner story approved";
  } catch (err) { error.value = err.response?.data?.message || "Unable to approve learner story"; }
};
watch(() => form.title, (title) => {
  form.slug = toSlug(title);
});
watch(titleSelection, selectModule);
onMounted(async () => {
  await loadModules();
  await loadPendingTestimonials();
  resetForm();
});
</script>

<style scoped>
.admin-panel { max-width: 900px; margin: 0 auto; padding: 32px 20px; text-align: left; }
.editor { display: grid; gap: 12px; padding: 20px; margin: 24px 0; border: 1px solid var(--border); border-radius: 10px; }
label { display: grid; gap: 4px; } input, textarea, select { padding: 8px; font: inherit; }
.term-editor { display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 8px; }
.module-list { list-style: none; padding: 0; } .module-list li { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border); }
.error { color: #b42318; } .success { color: #16794c; }
</style>
