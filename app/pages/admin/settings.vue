<template>
  <div class="pb-10">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-base-content">Settings</h1>
        <p class="text-sm text-base-content/50 mt-1">Global site properties &amp; configuration</p>
      </div>
    </div>

    <!-- MAIN LAYOUT -->
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- SIDEBAR -->
      <ul class="menu bg-base-100 border border-base-300 rounded-box w-full lg:w-60 shrink-0 p-2 gap-1 sticky top-24 h-max">
        <li class="menu-title text-xs font-bold tracking-widest text-base-content/50 uppercase">Admin</li>
        <li>
          <a :class="{ active: activeTab === 'general' }" @click="activeTab = 'general'">
            <IconSettings class="w-4 h-4" /> General Info
          </a>
        </li>
        <li>
          <a :class="{ active: activeTab === 'appearance' }" @click="activeTab = 'appearance'">
            <IconPalette class="w-4 h-4" /> Appearance
          </a>
        </li>
        <li>
          <a :class="{ active: activeTab === 'seo' }" @click="activeTab = 'seo'">
            <IconSearch class="w-4 h-4" /> SEO &amp; Social
          </a>
        </li>
        
        <template v-if="auth.isSuperAdmin.value">
          <div class="divider my-1 opacity-20"></div>
          <li class="menu-title text-xs font-bold tracking-widest text-secondary uppercase flex items-center gap-1.5">
            <IconShieldCog class="w-3.5 h-3.5" /> Superadmin
          </li>
          <li v-if="plan.hasFeature('cart')">
            <a :class="{ active: activeTab === 'shipping' }" @click="activeTab = 'shipping'">
              <IconTruck class="w-4 h-4" /> Shipping Config
            </a>
          </li>
          <li>
            <a :class="{ active: activeTab === 'features' }" @click="activeTab = 'features'">
              <IconToggleLeft class="w-4 h-4" /> Feature Flags
            </a>
          </li>
          <li>
            <a :class="{ active: activeTab === 'integrations' }" @click="activeTab = 'integrations'">
              <IconPlugConnected class="w-4 h-4" /> Integrations
            </a>
          </li>
          <li>
            <a :class="{ active: activeTab === 'database' }" @click="activeTab = 'database'">
              <IconDatabase class="w-4 h-4" /> Backup &amp; System
            </a>
          </li>
        </template>
      </ul>

      <!-- CONTENT PANES -->
      <div class="flex-1 w-full min-h-125">
        
        <!-- GENERAL SETTINGS -->
        <form v-if="activeTab === 'general'" @submit.prevent="save()" class="space-y-4">
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body">
              <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/50 mb-4">Site Information</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div class="space-y-4">
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Site Name</legend>
                    <input v-model="form.siteName" type="text" class="input w-full" />
                  </fieldset>
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Site Tagline</legend>
                    <input v-model="form.siteTagline" type="text" class="input w-full" />
                  </fieldset>
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Site URL</legend>
                    <input v-model="form.siteUrl" type="url" class="input w-full font-mono" placeholder="https://senseofjewels.com" />
                  </fieldset>
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Business Type</legend>
                      <select v-model="form.businessType" class="select w-full md:max-w-sm">
                      <option
                        v-for="option in businessTypeOptions"
                        :key="option.value"
                        :value="option.value"
                        :disabled="!option.available"
                      >
                        {{ option.label }}{{ option.available ? '' : ' (coming soon)' }}
                      </option>
                    </select>
                    <p class="label text-xs text-base-content/40">Controls the business identity and future module bundle.</p>
                  </fieldset>
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Template Preset</legend>
                    <select v-model="form.templateKey" class="select w-full md:max-w-sm">
                      <option v-for="templateOption in templateOptions" :key="templateOption.key" :value="templateOption.key">
                        {{ templateOption.label }}
                      </option>
                    </select>
                    <p class="label max-w-sm text-xs leading-relaxed whitespace-normal text-base-content/40">
                      Current Phase 1 keeps jewelry output identical
                      while moving rendering to template config.
                    </p>
                  </fieldset>
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Logo</legend>
                    <div v-if="form.logoUrl" class="mb-2 p-2 bg-base-200 rounded flex items-center gap-3">
                      <img :src="form.logoUrl" class="h-10 w-auto max-w-30 object-contain" alt="logo preview" />
                      <button type="button" class="btn btn-xs btn-ghost text-error ml-auto" @click="form.logoUrl = ''">Remove</button>
                    </div>
                    <button type="button" class="btn btn-sm btn-outline w-full mb-2" @click="openLogoPicker">
                      <IconPhoto class="w-4 h-4" /> Browse Media
                    </button>
                    <input v-model="form.logoUrl" type="text" class="input input-sm w-full font-mono" placeholder="Or paste URL..." />
                  </fieldset>
                </div>
                
                <div class="space-y-4">
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Contact Email</legend>
                    <input v-model="form.contactEmail" type="email" class="input w-full" />
                  </fieldset>
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Contact Phone</legend>
                    <input v-model="form.contactPhone" type="text" class="input w-full" />
                  </fieldset>
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">WhatsApp Number</legend>
                    <input v-model="form.whatsappNumber" type="text" class="input w-full" />
                  </fieldset>
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Instagram URL</legend>
                    <input v-model="form.instagramUrl" type="url" class="input w-full" />
                  </fieldset>
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Address</legend>
                    <textarea v-model="form.address" class="textarea w-full" rows="2"></textarea>
                  </fieldset>
                </div>
              </div>
            </div>
            
            <div class="card-body border-t border-base-200 pt-5">
               <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/50 mb-2">Currency Conversion</h2>
               <div class="bg-base-200/50 px-4 py-3 rounded-lg text-sm">
                <p class="font-semibold text-xs uppercase tracking-wide text-base-content/50 mb-1">USD → IDR Exchange Rate</p>
                <p class="text-base-content">
                  <span v-if="liveRate">1 USD = <strong>{{ liveRate.IDR.toLocaleString('id-ID') }}</strong> IDR
                    <span class="badge badge-xs ml-2" :class="liveRate.source === 'live' ? 'badge-success' : 'badge-warning'">
                      {{ liveRate.source === 'live' ? 'Live' : 'Fallback' }}
                    </span>
                  </span>
                  <span v-else class="text-base-content/40">Loading...</span>
                </p>
                <p class="text-xs text-base-content/40 mt-1">Auto-fetched from open.er-api.com · cached 1 hour</p>
              </div>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save General Settings' }}
          </button>
        </form>

        <!-- APPEARANCE SETTINGS -->
        <form v-if="activeTab === 'appearance'" @submit.prevent="save()" class="space-y-4">
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body">
              <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/50 mb-4">Color Theme</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <fieldset class="fieldset"><legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Primary</legend><div class="flex gap-2 items-center"><input type="color" v-model="form.colorPrimary" class="w-10 h-10 rounded cursor-pointer border border-base-300 p-0.5" /><input type="text" v-model="form.colorPrimary" class="input input-sm flex-1 font-mono" /></div></fieldset>
                  <fieldset class="fieldset"><legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Primary Content</legend><div class="flex gap-2 items-center"><input type="color" v-model="form.colorPrimaryContent" class="w-10 h-10 rounded cursor-pointer border border-base-300 p-0.5" /><input type="text" v-model="form.colorPrimaryContent" class="input input-sm flex-1 font-mono" /></div></fieldset>
                  <fieldset class="fieldset"><legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Secondary</legend><div class="flex gap-2 items-center"><input type="color" v-model="form.colorSecondary" class="w-10 h-10 rounded cursor-pointer border border-base-300 p-0.5" /><input type="text" v-model="form.colorSecondary" class="input input-sm flex-1 font-mono" /></div></fieldset>
                  <fieldset class="fieldset"><legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Accent</legend><div class="flex gap-2 items-center"><input type="color" v-model="form.colorAccent" class="w-10 h-10 rounded cursor-pointer border border-base-300 p-0.5" /><input type="text" v-model="form.colorAccent" class="input input-sm flex-1 font-mono" /></div></fieldset>
                  <fieldset class="fieldset"><legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Base (Background)</legend><div class="flex gap-2 items-center"><input type="color" v-model="form.colorBase100" class="w-10 h-10 rounded cursor-pointer border border-base-300 p-0.5" /><input type="text" v-model="form.colorBase100" class="input input-sm flex-1 font-mono" /></div></fieldset>
                  <fieldset class="fieldset"><legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Text Color</legend><div class="flex gap-2 items-center"><input type="color" v-model="form.colorBaseContent" class="w-10 h-10 rounded cursor-pointer border border-base-300 p-0.5" /><input type="text" v-model="form.colorBaseContent" class="input input-sm flex-1 font-mono" /></div></fieldset>
              </div>
              <div class="flex gap-1.5 mt-2 rounded-lg overflow-hidden h-8 w-full max-w-sm">
                <div class="flex-1" :style="{ background: form.colorPrimary }"></div>
                <div class="flex-1" :style="{ background: form.colorSecondary }"></div>
                <div class="flex-1" :style="{ background: form.colorAccent }"></div>
                <div class="flex-1 border border-base-300" :style="{ background: form.colorBase100 }"></div>
              </div>
            </div>
            <div class="card-body border-t border-base-200 pt-5">
              <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/50 mb-4">Typography</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Heading Font</legend>
                    <select v-model="form.fontHeading" class="select select-sm w-full">
                      <option v-for="f in FONT_OPTIONS" :key="f.value" :value="f.value">{{ f.label }}</option>
                    </select>
                  </fieldset>

                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Body Font</legend>
                    <select v-model="form.fontBody" class="select select-sm w-full">
                      <option v-for="f in FONT_OPTIONS" :key="f.value" :value="f.value">{{ f.label }}</option>
                    </select>
                  </fieldset>
              </div>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Appearance' }}
          </button>
        </form>

        <!-- SEO SETTINGS -->
        <form v-if="activeTab === 'seo'" @submit.prevent="save()" class="space-y-4">
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body">
              <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/50 mb-4">Search &amp; Social Metadata</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div class="space-y-4">
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Meta Description</legend>
                    <textarea v-model="form.metaDescription" class="textarea w-full" rows="3" placeholder="Short description"></textarea>
                    <p class="label text-xs" :class="(form.metaDescription?.length ?? 0) > 160 ? 'text-error' : 'text-base-content/40'">
                      {{ form.metaDescription?.length ?? 0 }}/160 chars
                    </p>
                  </fieldset>

                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Meta Keywords</legend>
                    <input v-model="form.metaKeywords" type="text" class="input w-full" placeholder="jewelry, bali, necklace" />
                  </fieldset>

                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Google Analytics ID</legend>
                    <input v-model="form.googleAnalyticsId" type="text" class="input w-full font-mono" placeholder="G-XXXXXXXXXX" />
                  </fieldset>
                </div>
                
                <div class="space-y-4">
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Default Social Share Image (OG)</legend>
                    <div class="flex gap-2">
                      <input v-model="form.ogImage" type="text" class="input input-sm flex-1 font-mono" placeholder="Paste URL..." />
                      <button type="button" class="btn btn-sm btn-outline shrink-0" @click="ogPickerOpen = true">
                        <IconPhoto class="w-4 h-4" />
                      </button>
                    </div>
                  </fieldset>

                  <div class="mt-2 rounded-lg border border-base-300 overflow-hidden text-sm shadow-sm max-w-sm">
                    <div class="aspect-1200/630 bg-base-200 relative group">
                      <img v-if="form.ogImage" :src="form.ogImage" class="w-full h-full object-contain bg-black/5" />
                      <div v-else class="w-full h-full flex items-center justify-center text-base-content/20 text-xs">No image</div>
                      <button v-if="form.ogImage" type="button" class="absolute top-2 right-2 btn btn-xs btn-circle btn-error opacity-0 group-hover:opacity-100 transition-opacity" @click="form.ogImage = ''"><IconX class="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save SEO Data' }}
          </button>
        </form>

        <!-- SHIPPING SETTINGS (SUPERADMIN) -->
        <div v-if="activeTab === 'shipping' && auth.isSuperAdmin.value && plan.hasFeature('cart')" class="space-y-4">
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body">
              <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/50 mb-4">RajaOngkir Shipping Configurations</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Origin City (Warehouse)</legend>
                    <div class="relative">
                      <input v-model="originCitySearch" @input="onOriginCitySearch" type="text" placeholder="Type city name..." class="input w-full" autocomplete="off" />
                      <div v-if="originCityResults.length" class="absolute top-full left-0 right-0 z-50 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        <button v-for="city in originCityResults" :key="city.id" type="button" @click="selectOriginCity(city)" class="w-full text-left px-3 py-2 text-sm hover:bg-base-200 transition-colors border-b border-base-200 last:border-0">
                          {{ city.label }}
                        </button>
                      </div>
                    </div>
                    <p v-if="form.shippingOriginCityName" class="label text-xs text-success font-medium mt-1">
                      ✓ {{ form.shippingOriginCityName }} (ID: {{ form.shippingOriginCityId }})
                    </p>
                  </fieldset>
                  
                  <fieldset class="fieldset mt-4">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Default Weight per Item (grams)</legend>
                    <input v-model="form.shippingDefaultWeight" type="number" min="1" max="30000" class="input w-32" />
                  </fieldset>
                </div>
                
                <div class="space-y-4">
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Available Couriers</legend>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-base-200/30 border border-base-200 rounded-lg">
                      <label v-for="c in COURIER_LIST" :key="c.code" class="flex items-center gap-3 cursor-pointer select-none group">
                        <input type="checkbox" :checked="activeCouriers.includes(c.code)" @change="toggleCourier(c.code)" class="checkbox checkbox-sm checkbox-primary" />
                        <span class="text-sm group-hover:text-primary transition-colors">{{ c.name }}</span>
                        <span v-if="c.pro" class="badge badge-xs badge-ghost scale-90 -ml-1">Pro</span>
                      </label>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </div>
          <button type="button" class="btn btn-primary" :disabled="savingShipping" @click="saveShipping">
            {{ savingShipping ? 'Saving...' : 'Save Shipping Settings' }}
          </button>
        </div>

        <!-- FEATURES FLAG (SUPERADMIN) -->
        <div v-if="activeTab === 'features' && auth.isSuperAdmin.value" class="space-y-4">
          <div class="card bg-base-100 border border-secondary shadow-[0_0_15px_-5px_rgba(var(--color-secondary),0.3)]">
            <div class="card-body">
              <div class="flex items-center gap-2 mb-4">
                <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/50">Premium Modules &amp; Features</h2>
                <span class="badge badge-soft badge-secondary text-xs ml-auto">Superadmin Only</span>
              </div>
              <div class="grid grid-cols-1 gap-3">
                <div v-for="(feat, key) in FEATURES" :key="key"
                  class="flex items-start gap-4 p-4 rounded-xl border transition-colors"
                  :class="form[feat.key] === 'true' ? 'border-success/40 bg-success/5' : 'border-base-300 bg-base-200/30'">
                  <input type="checkbox"
                    :checked="form[feat.key] === 'true'"
                    @change="form[feat.key] = ($event.target as HTMLInputElement).checked ? 'true' : 'false'"
                    class="checkbox checkbox-success mt-0.5 shrink-0"
                  />
                  <div>
                    <p class="text-sm font-semibold text-base-content/90">{{ feat.label }}</p>
                    <p class="text-xs text-base-content/60 mt-1 leading-relaxed">{{ feat.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button type="button" class="btn btn-secondary text-primary" :disabled="savingFeatures" @click="saveFeatures">
            {{ savingFeatures ? 'Saving...' : 'Update Feature Flags' }}
          </button>
        </div>

        <!-- INTEGRATIONS (SUPERADMIN) -->
        <div v-if="activeTab === 'integrations' && auth.isSuperAdmin.value" class="space-y-4">
          <div class="card bg-base-100 border border-base-300">
             <div class="card-body">
               <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/50 mb-4">External Ecosystem Hub</h2>
               <div class="grid gap-4">
                 <div class="p-5 rounded-xl border border-base-200 bg-base-200/20 flex items-center justify-between">
                   <div class="flex items-center gap-4">
                     <div class="bg-primary/10 rounded-lg p-3">
                       <IconPlugConnected class="w-6 h-6 text-primary" />
                     </div>
                     <div>
                       <h2 class="font-bold text-base text-base-content">OCS Workspace</h2>
                       <p class="text-sm text-base-content/60">Sync orders and settings with remote hub.</p>
                     </div>
                   </div>
                   <NuxtLink to="/admin/integrations" class="btn btn-outline border-base-300 gap-2 shrink-0">Configure</NuxtLink>
                 </div>
                 
                 <div class="p-5 rounded-xl border border-base-200 bg-base-200/20 flex items-center justify-between">
                   <div class="flex items-center gap-4">
                     <div class="bg-error/10 rounded-lg p-3">
                       <IconBug class="w-6 h-6 text-error" />
                     </div>
                     <div>
                       <h2 class="font-bold text-base text-base-content">Project Tracker</h2>
                       <p class="text-sm text-base-content/60">Submit bugs and track project progress.</p>
                     </div>
                   </div>
                   <NuxtLink to="/admin/tracker" class="btn btn-outline border-base-300 gap-2 shrink-0">Open Tracker</NuxtLink>
                 </div>
               </div>
             </div>
          </div>
        </div>

        <!-- DATABASE BACKUP (SUPERADMIN) -->
        <div v-if="activeTab === 'database' && auth.isSuperAdmin.value" class="space-y-4">
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4 border-b border-base-200 pb-4">
                <div>
                  <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/50">Database Snapshots</h2>
                  <p class="text-xs text-base-content/50 mt-1 max-w-sm">Automated tasks run at 23:00. Keeps up to 7 rolling compressed .sql dumps.</p>
                </div>
                <button type="button" class="btn btn-sm btn-primary shrink-0 gap-2" :disabled="creatingBackup" @click="triggerBackup">
                  <span v-if="creatingBackup" class="loading loading-spinner loading-xs"></span>
                  <IconDatabaseExport v-else class="w-4 h-4" /> Trigger Manual Backup
                </button>
              </div>

              <div v-if="backupsLoading" class="text-center py-10">
                <span class="loading loading-spinner opacity-50"></span>
              </div>
              <div v-else-if="!backups.length" class="text-center py-10 opacity-50">No backups found.</div>
              <div v-else class="space-y-2">
                <div v-for="backup in backups" :key="backup.filename" class="flex items-center p-3 rounded-lg border border-base-200 hover:bg-base-200/50">
                  <IconFileTypeJs class="w-5 h-5 text-secondary mr-3" />
                  <div class="flex-1">
                    <p class="text-sm font-mono text-base-content/90">{{ backup.filename }}</p>
                    <p class="text-xs text-base-content/50">{{ formatBackupDate(backup.createdAt) }} • {{ formatBackupSize(backup.size) }}</p>
                  </div>
                  <a :href="'/api/backup/' + backup.filename" class="btn btn-sm btn-ghost gap-2">
                    <IconDownload class="w-4 h-4" /> Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- MODALS (LOGO & OG) -->
    <dialog class="modal" :open="showLogoPicker">
      <div class="modal-box max-w-3xl">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" @click="showLogoPicker = false"><IconX class="w-4 h-4" /></button>
        <h3 class="font-bold text-lg mb-4">Pick Logo from Media</h3>
        <div v-if="!mediaData?.media?.length" class="text-center py-8 text-base-content/40">No media found.</div>
        <div v-else class="grid grid-cols-4 md:grid-cols-5 gap-3">
          <button v-for="m in mediaData.media" :key="m.id" type="button" class="aspect-square bg-base-200 rounded-lg overflow-hidden border-2" :class="form.logoUrl === m.url ? 'border-primary' : 'border-transparent'" @click="pickLogo(m.url)">
            <img :src="m.url" class="w-full h-full object-cover" />
            <div v-if="form.logoUrl === m.url" class="absolute inset-0 bg-primary/20 flex items-center justify-center"><span class="badge badge-primary badge-sm">Selected</span></div>
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop" @click="showLogoPicker = false"><button>close</button></form>
    </dialog>

    <MediaPickerModal :open="ogPickerOpen" :selected="form.ogImage" @close="ogPickerOpen = false" @pick="url => form.ogImage = url" />
  </div>
</template>


<script setup lang="ts">
import {
  BUSINESS_TYPE_OPTIONS,
  DEFAULT_TEMPLATE_KEY,
  getTemplateOptionsForBusinessType,
} from '~/templates/registry'
import {
  IconArrowRight,
  IconBug,
  IconDatabase,
  IconDatabaseExport,
  IconDownload,
  IconFileTypeJs,
  IconLock,
  IconPalette,
  IconPhoto,
  IconPlugConnected,
  IconSearch,
  IconSettings,
  IconShieldCog,
  IconToggleLeft,
  IconTruck,
  IconX,
} from '@tabler/icons-vue'
import { THEME_DEFAULTS, FONT_OPTIONS } from '~/composables/useTheme'
import { FEATURES } from '~/composables/usePlan'
import type { BusinessType, Media, CityOption } from '~/types'

const COURIER_LIST = [
  { code: 'jne', name: 'JNE', pro: false },
  { code: 'tiki', name: 'TIKI', pro: false },
  { code: 'pos', name: 'Pos Indonesia', pro: false },
  { code: 'jnt', name: 'J&T Express', pro: true },
  { code: 'sicepat', name: 'SiCepat', pro: true },
  { code: 'anteraja', name: 'AnterAja', pro: true },
  { code: 'wahana', name: 'Wahana', pro: true },
  { code: 'lion', name: 'Lion Parcel', pro: true },
  { code: 'ninja', name: 'Ninja Xpress', pro: true },
]

const auth = useAuth();
const activeTab = ref('general');
const plan = usePlan()

// Origin city search for shipping
const originCitySearch = ref('')
const originCityResults = ref<CityOption[]>([])
let originCityTimer: ReturnType<typeof setTimeout> | null = null

async function onOriginCitySearch() {
  if (originCityTimer) clearTimeout(originCityTimer)
  const q = originCitySearch.value.trim()
  if (q.length < 2) { originCityResults.value = []; return }
  originCityTimer = setTimeout(async () => {
    originCityResults.value = await $fetch<CityOption[]>(`/api/shipping/cities?q=${encodeURIComponent(q)}`).catch(() => [])
  }, 350)
}

function selectOriginCity(city: CityOption) {
  form.value.shippingOriginCityId = city.id
  form.value.shippingOriginCityName = city.label
  originCitySearch.value = city.label
  originCityResults.value = []
}

const activeCouriers = computed<string[]>({
  get: () => (form.value.shippingCouriers || '').split(',').map(s => s.trim()).filter(Boolean),
  set: (val) => { form.value.shippingCouriers = val.join(',') },
})

function toggleCourier(code: string) {
  const list = activeCouriers.value
  activeCouriers.value = list.includes(code) ? list.filter(c => c !== code) : [...list, code]
}

const savingShipping = ref(false)
async function saveShipping() {
  savingShipping.value = true
  try {
    await $fetch('/api/settings', {
      method: 'PUT',
      body: {
        shippingOriginCityId: form.value.shippingOriginCityId,
        shippingOriginCityName: form.value.shippingOriginCityName,
        shippingCouriers: form.value.shippingCouriers,
        shippingDefaultWeight: form.value.shippingDefaultWeight,
      },
    })
  }
  finally { savingShipping.value = false }
}

interface MediaResponse { media: Media[]; folders: string[] }

const showLogoPicker = ref(false)
const ogPickerOpen = ref(false)
const { data: mediaData, execute: loadMedia } = useFetch<MediaResponse>('/api/media', { immediate: false })

async function openLogoPicker() {
  await loadMedia()
  showLogoPicker.value = true
}

function pickLogo(url: string) {
  form.value.logoUrl = url
  showLogoPicker.value = false
}

const { data: settings } = useFetch<Record<string, string>>('/api/settings')
const { data: liveRate } = useFetch<{ IDR: number; source: string }>('/api/exchange-rate')
const saving = ref(false)
const savingFeatures = ref(false)

async function saveFeatures() {
  savingFeatures.value = true
  try {
    await $fetch('/api/settings', {
      method: 'PUT',
      body: {
        featureShop: form.value.featureShop,
        featureCart: form.value.featureCart,
        featureBlog: form.value.featureBlog,
        featureSeo: form.value.featureSeo,
        featureTheme: form.value.featureTheme,
      },
    })
  } finally {
    savingFeatures.value = false
  }
}

useTheme(settings)

const form = ref({
  businessType: 'jewelry',
  templateKey: DEFAULT_TEMPLATE_KEY,
  siteName: '',
  siteTagline: '',
  siteUrl: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  instagramUrl: '',
  whatsappNumber: '',
  logoUrl: '',
  colorPrimary: THEME_DEFAULTS.colorPrimary,
  colorPrimaryContent: THEME_DEFAULTS.colorPrimaryContent,
  colorSecondary: THEME_DEFAULTS.colorSecondary,
  colorAccent: THEME_DEFAULTS.colorAccent,
  colorBase100: THEME_DEFAULTS.colorBase100,
  colorBaseContent: THEME_DEFAULTS.colorBaseContent,
  fontHeading: THEME_DEFAULTS.fontHeading,
  fontBody: THEME_DEFAULTS.fontBody,
  metaDescription: '',
  metaKeywords: '',
  ogImage: '',
  googleAnalyticsId: '',
  // Feature flags
  featureShop: 'false',
  featureCart: 'false',
  featureBlog: 'false',
  featureSeo: 'false',
  featureTheme: 'false',
  // Shipping
  shippingOriginCityId: '',
  shippingOriginCityName: '',
  shippingCouriers: 'jne,tiki,pos',
  shippingDefaultWeight: '500',
} as Record<string, string>)

const businessTypeOptions = BUSINESS_TYPE_OPTIONS
const templateOptions = computed(() => {
  const options = getTemplateOptionsForBusinessType((form.value.businessType as BusinessType) || 'jewelry')
  return options.length ? options : getTemplateOptionsForBusinessType('jewelry')
})

watch(() => form.value.businessType, (businessType) => {
  const options = getTemplateOptionsForBusinessType((businessType as BusinessType) || 'jewelry')
  if (!options.some(option => option.key === form.value.templateKey)) {
    form.value.templateKey = options[0]?.key || DEFAULT_TEMPLATE_KEY
  }
})

// Load selected fonts in the admin for live preview
useHead({
  link: () => {
    const fonts = [...new Set([form.value.fontHeading, form.value.fontBody].filter(Boolean))]
    if (!fonts.length) return []
    const params = fonts.filter((f): f is string => !!f).map(f => `family=${encodeURIComponent(f)}:wght@300;400;500;600`).join('&')
    return [{ rel: 'stylesheet', href: `https://fonts.googleapis.com/css2?${params}&display=swap`, key: 'admin-preview-fonts' }]
  },
})

watchEffect(() => {
  if (settings.value) {
    form.value = {
      businessType: settings.value.businessType || 'jewelry',
      templateKey: settings.value.templateKey || DEFAULT_TEMPLATE_KEY,
      siteName: settings.value.siteName || 'Sense of Jewels',
      siteTagline: settings.value.siteTagline || '',
      siteUrl: settings.value.siteUrl || '',
      contactEmail: settings.value.contactEmail || '',
      contactPhone: settings.value.contactPhone || '',
      address: settings.value.address || '',
      instagramUrl: settings.value.instagramUrl || '',
      whatsappNumber: settings.value.whatsappNumber || '',
      logoUrl: settings.value.logoUrl || '',
      colorPrimary: settings.value.colorPrimary || THEME_DEFAULTS.colorPrimary,
      colorPrimaryContent: settings.value.colorPrimaryContent || THEME_DEFAULTS.colorPrimaryContent,
      colorSecondary: settings.value.colorSecondary || THEME_DEFAULTS.colorSecondary,
      colorAccent: settings.value.colorAccent || THEME_DEFAULTS.colorAccent,
      colorBase100: settings.value.colorBase100 || THEME_DEFAULTS.colorBase100,
      colorBaseContent: settings.value.colorBaseContent || THEME_DEFAULTS.colorBaseContent,
      fontHeading: settings.value.fontHeading ?? THEME_DEFAULTS.fontHeading,
      fontBody: settings.value.fontBody ?? THEME_DEFAULTS.fontBody,
      metaDescription: settings.value.metaDescription || '',
      metaKeywords: settings.value.metaKeywords || '',
      ogImage: settings.value.ogImage || '',
      googleAnalyticsId: settings.value.googleAnalyticsId || '',
      featureShop: settings.value.featureShop ?? 'false',
      featureCart: settings.value.featureCart ?? 'false',
      featureBlog: settings.value.featureBlog ?? 'false',
      featureSeo: settings.value.featureSeo ?? 'false',
      featureTheme: settings.value.featureTheme ?? 'false',
      shippingOriginCityId: settings.value.shippingOriginCityId || '',
      shippingOriginCityName: settings.value.shippingOriginCityName || '',
      shippingCouriers: settings.value.shippingCouriers || 'jne,tiki,pos',
      shippingDefaultWeight: settings.value.shippingDefaultWeight || '500',
    }
    // Pre-fill origin city search text
    if (settings.value.shippingOriginCityName) {
      originCitySearch.value = settings.value.shippingOriginCityName
    }
  }
})

async function save() {
  saving.value = true
  try {
    await $fetch('/api/settings', { method: 'PUT', body: form.value })
  } finally {
    saving.value = false
  }
}

// ── Backup ────────────────────────────────────────────────
interface BackupMeta { filename: string; size: number; createdAt: string }

const backups = ref<BackupMeta[]>([])
const backupsLoading = ref(false)
const creatingBackup = ref(false)

async function fetchBackups() {
  backupsLoading.value = true
  try {
    backups.value = await $fetch<BackupMeta[]>('/api/backup')
  } finally {
    backupsLoading.value = false
  }
}

async function triggerBackup() {
  creatingBackup.value = true
  try {
    await $fetch('/api/backup/create', { method: 'POST' })
    await fetchBackups()
  } finally {
    creatingBackup.value = false
  }
}

function formatBackupDate(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatBackupSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(2)} MB`
}

onMounted(() => fetchBackups())
</script>
