<template>
  <div class="pb-10">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-base-content">Settings</h1>
        <p class="text-sm text-base-content/50 mt-1">{{ settingsSubtitle }}</p>
      </div>
    </div>

    <div v-if="licenseRecoveryNotice" class="alert mb-6" :class="licenseStatusPanelClass(licenseValidation.status || 'invalid')">
      <IconAlertCircle class="h-5 w-5 shrink-0" />
      <span>{{ licenseRecoveryNotice }}</span>
    </div>

    <!-- MAIN LAYOUT -->
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- SIDEBAR -->
      <ul class="settings-menu menu bg-base-100 border border-base-300 rounded-box w-full lg:w-60 shrink-0 p-2 gap-1 sticky top-24 h-max">
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
                    <input v-model="form.siteUrl" type="url" class="input w-full font-mono" :placeholder="siteUrlPlaceholder" />
                  </fieldset>
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">License Key</legend>
                    <input v-model="form.licenseKey" type="text" class="input w-full font-mono" placeholder="PB-XXXX-XXXX-XXXX" />
                    <p class="label text-xs text-base-content/40">Gunakan key dari License Admin untuk validasi domain CMS ini.</p>
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
                    <p class="label text-xs text-base-content/40">Controls the business identity, default sections, and active admin workflow.</p>
                  </fieldset>
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Template Preset</legend>
                    <div class="max-w-md rounded-2xl border border-base-300 bg-base-200/35 px-4 py-4">
                      <p class="text-sm font-medium text-base-content">{{ selectedTemplateOption?.label || 'Template not selected' }}</p>
                      <p class="mt-1 text-xs leading-relaxed text-base-content/55">{{ selectedTemplateOption?.description || 'Template selection now lives in the dedicated Template Library page.' }}</p>
                      <div class="mt-3 flex flex-wrap gap-2">
                        <NuxtLink to="/admin/templates" class="btn btn-sm btn-outline border-base-300">Open Template Library</NuxtLink>
                        <a v-if="form.draftTemplateKey" :href="draftPreviewHref" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-ghost">Preview Draft</a>
                      </div>
                    </div>
                    <p class="label max-w-sm text-xs leading-relaxed whitespace-normal text-base-content/40">
                      Active template is published from Template Library. Draft templates can be previewed there before going live.
                    </p>
                  </fieldset>
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Logo</legend>
                    <div v-if="form.logoUrl" class="mb-2 p-2 bg-base-200 rounded flex items-center gap-3">
                      <img :src="form.logoUrl" class="h-10 w-auto max-w-30 object-contain" alt="logo preview" />
                      <button type="button" class="btn btn-xs btn-ghost text-error ml-auto" @click="form.logoUrl = ''">Remove</button>
                    </div>
                    <button type="button" class="btn btn-sm btn-outline w-full mb-2" :disabled="!mediaLibraryEnabled" @click="openLogoPicker">
                      <IconPhoto class="w-4 h-4" /> Browse Media
                    </button>
                    <p v-if="!mediaLibraryEnabled" class="label text-xs text-base-content/40">Media browser is disabled by the Media Library feature flag. You can still paste a direct URL manually.</p>
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

                  <div class="rounded-2xl border border-base-300 bg-base-200/30 px-4 py-4 space-y-3">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-base-content/50">License Validation</p>
                        <p class="mt-2 text-sm text-base-content/70">Test key terhadap domain CMS ini, lalu apply fitur yang dilisensikan ke feature flags bila diperlukan.</p>
                      </div>
                      <span v-if="licenseValidation.status" class="badge badge-soft" :class="licenseStatusBadgeClass(licenseValidation.status)">
                        {{ licenseValidation.status }}
                      </span>
                    </div>

                    <div class="grid gap-3 md:grid-cols-2">
                      <div class="rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-sm">
                        <p class="text-xs uppercase tracking-[0.2em] text-base-content/45">Domain</p>
                        <p class="mt-2 font-mono text-base-content">{{ derivedLicenseDomain || 'Set site URL first' }}</p>
                      </div>
                      <div class="rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-sm">
                        <p class="text-xs uppercase tracking-[0.2em] text-base-content/45">Last validation</p>
                        <p class="mt-2 text-base-content">{{ licenseValidationLastLabel }}</p>
                      </div>
                    </div>

                    <div v-if="licenseValidation.message" class="rounded-xl border px-4 py-3 text-sm" :class="licenseStatusPanelClass(licenseValidation.status)">
                      {{ licenseValidation.message }}
                    </div>

                    <div v-if="licenseValidation.features.length" class="flex flex-wrap gap-2">
                      <span v-for="feature in licenseValidation.features" :key="feature" class="badge badge-soft badge-secondary">{{ feature }}</span>
                    </div>

                    <div class="flex flex-wrap gap-2">
                      <button type="button" class="btn btn-sm btn-outline" :disabled="licenseActionLoading || !form.licenseKey" @click="validateCmsLicense(false)">
                        {{ licenseActionLoading ? 'Testing...' : 'Test License' }}
                      </button>
                      <button type="button" class="btn btn-sm btn-secondary text-primary" :disabled="licenseActionLoading || !form.licenseKey" @click="validateCmsLicense(true)">
                        {{ licenseActionLoading ? 'Applying...' : 'Test + Apply Features' }}
                      </button>
                      <button type="button" class="btn btn-sm btn-ghost text-error" :disabled="licenseUnbindLoading || (!form.licenseKey && !form.licenseStatus)" @click="clearCmsLicense">
                        <IconTrash class="h-4 w-4" />
                        {{ licenseUnbindLoading ? 'Clearing...' : 'Clear / Unbind License' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card-body border-t border-base-200 pt-5">
               <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/50 mb-2">Currency Conversion</h2>
               <div class="bg-base-200/50 px-4 py-3 rounded-lg text-sm">
                <p class="font-semibold text-xs uppercase tracking-wide text-base-content/50 mb-1">USD → IDR Exchange Rate</p>
                <p class="text-base-content">
                  <span v-if="liveRate">1 USD = <strong>{{ formatRateIdr(liveRate.IDR) }}</strong> IDR
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
                    <input v-model="form.metaKeywords" type="text" class="input w-full" :placeholder="metaKeywordsPlaceholder" />
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
                      <button type="button" class="btn btn-sm btn-outline shrink-0" :disabled="!mediaLibraryEnabled" @click="ogPickerOpen = true">
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
          <div class="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]">
            <div class="card bg-base-100 border border-base-300">
              <div class="card-body gap-4">
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/60">License Summary</h2>
                  <span class="badge badge-soft badge-secondary">Live Preview</span>
                </div>
                <div class="grid gap-3 sm:grid-cols-3">
                  <div class="rounded-2xl border border-success/30 bg-success/5 px-4 py-3">
                    <p class="text-xs font-semibold uppercase tracking-[0.24em] text-success/80">Active</p>
                    <p class="mt-2 text-2xl font-semibold text-base-content">{{ licenseSummary.active }}</p>
                    <p class="mt-1 text-xs text-base-content/50">Modules currently available</p>
                  </div>
                  <div class="rounded-2xl border border-base-300 bg-base-200/40 px-4 py-3">
                    <p class="text-xs font-semibold uppercase tracking-[0.24em] text-base-content/55">Locked</p>
                    <p class="mt-2 text-2xl font-semibold text-base-content">{{ licenseSummary.explicitlyDisabled }}</p>
                    <p class="mt-1 text-xs text-base-content/50">Modules intentionally turned off</p>
                  </div>
                  <div class="rounded-2xl border border-warning/30 bg-warning/5 px-4 py-3">
                    <p class="text-xs font-semibold uppercase tracking-[0.24em] text-warning/90">Blocked</p>
                    <p class="mt-2 text-2xl font-semibold text-base-content">{{ licenseSummary.dependencyBlocked }}</p>
                    <p class="mt-1 text-xs text-base-content/50">Child modules blocked by dependency rules</p>
                  </div>
                </div>
                <div class="grid gap-3 sm:grid-cols-3">
                  <div v-for="category in categorySummaries" :key="category.name" class="rounded-2xl border border-base-300 bg-base-100 px-4 py-3">
                    <div class="flex items-center justify-between gap-3">
                      <p class="text-sm font-semibold text-base-content">{{ category.name }}</p>
                      <span class="badge badge-soft badge-sm">{{ category.active }}/{{ category.total }}</span>
                    </div>
                    <p class="mt-2 text-xs text-base-content/55">{{ category.enabledLabel }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="card border border-info/30 bg-info/5">
              <div class="card-body gap-3">
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/70">Dependency Rules</h2>
                  <span class="badge badge-soft badge-info">Auto Evaluation</span>
                </div>
                <p class="text-sm leading-7 text-base-content/70">Child modules can stay checked in the form, but they remain unavailable until all required parent modules are enabled.</p>
                <div class="space-y-3 text-sm text-base-content/65">
                  <div class="rounded-xl border border-base-300 bg-base-100/70 px-4 py-3">
                    <p class="font-semibold text-base-content">Cart depends on Shop</p>
                    <p class="mt-1">If Shop is disabled, checkout-related flows remain locked even when Cart stays checked.</p>
                  </div>
                  <div class="rounded-xl border border-base-300 bg-base-100/70 px-4 py-3">
                    <p class="font-semibold text-base-content">Booking Engine depends on Room Inventory</p>
                    <p class="mt-1">If room inventory is disabled, booking routes, guesthouse booking UI, and admin bookings remain unavailable automatically.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card border border-warning/30 bg-warning/5">
            <div class="card-body gap-3">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/70">Feature Lock Impact</h2>
                <span class="badge badge-soft badge-warning">Read Before Saving</span>
              </div>
              <p class="text-sm leading-7 text-base-content/70">Feature flags in this panel are live operational locks. Disabling a module can hide public sections, remove admin menus, and block direct routes immediately.</p>
              <div class="grid gap-3 md:grid-cols-2">
                <div class="rounded-xl border border-base-300 bg-base-100/70 px-4 py-3 text-sm text-base-content/65">
                  <p class="font-semibold text-base-content">Booking Engine</p>
                  <p class="mt-1">Turning this off removes <span class="font-mono">/book</span>, <span class="font-mono">/booking-status</span>, the booking section on guesthouse landing pages, and the admin Bookings menu.</p>
                </div>
                <div class="rounded-xl border border-base-300 bg-base-100/70 px-4 py-3 text-sm text-base-content/65">
                  <p class="font-semibold text-base-content">Room Inventory</p>
                  <p class="mt-1">Turning this off removes the guesthouse room showcase and admin Rooms page. Booking Engine becomes unavailable automatically because it depends on room inventory.</p>
                </div>
                <div class="rounded-xl border border-base-300 bg-base-100/70 px-4 py-3 text-sm text-base-content/65">
                  <p class="font-semibold text-base-content">Testimonials</p>
                  <p class="mt-1">Turning this off removes review/testimonial sections from the landing page and hides the admin Testimonials page.</p>
                </div>
                <div class="rounded-xl border border-base-300 bg-base-100/70 px-4 py-3 text-sm text-base-content/65">
                  <p class="font-semibold text-base-content">Media Library</p>
                  <p class="mt-1">Turning this off hides the admin Media page and disables embedded media browser shortcuts. Existing image URLs remain usable if pasted manually.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card bg-base-100 border border-secondary shadow-[0_0_15px_-5px_rgba(var(--color-secondary),0.3)]">
            <div class="card-body">
              <div class="flex flex-wrap items-center gap-2 mb-4">
                <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/50">Premium Modules &amp; Features</h2>
                <span class="badge badge-soft badge-secondary text-xs ml-auto">Superadmin Only</span>
              </div>
              <div class="mb-4 flex flex-wrap gap-2">
                <button
                  v-for="category in featureCategoryFilters"
                  :key="category"
                  type="button"
                  class="badge badge-sm cursor-pointer px-3 py-3 transition-all"
                  :class="selectedFeatureCategory === category ? 'badge-primary' : 'badge-ghost hover:badge-neutral'"
                  @click="selectedFeatureCategory = category"
                >
                  {{ category }}
                </button>
              </div>
              <div class="grid grid-cols-1 gap-3">
                <div v-for="feature in filteredFeatureEntries" :key="feature.name"
                  class="flex items-start gap-4 p-4 rounded-xl border transition-colors"
                  :class="feature.isEnabled ? 'border-success/40 bg-success/5' : feature.isBlockedByDependencies ? 'border-warning/40 bg-warning/5' : 'border-base-300 bg-base-200/30'">
                  <input type="checkbox"
                    :checked="feature.isExplicitlyEnabled"
                    :disabled="feature.isLicenseLocked"
                    @change="feature.isLicenseLocked ? null : (form[feature.key] = ($event.target as HTMLInputElement).checked ? 'true' : 'false')"
                    class="checkbox checkbox-success mt-0.5 shrink-0 disabled:cursor-not-allowed disabled:opacity-45"
                  />
                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <p class="text-sm font-semibold text-base-content/90">{{ feature.label }}</p>
                      <span class="badge badge-soft badge-sm" :class="feature.category === 'Jewelry' ? 'badge-secondary' : feature.category === 'Guesthouse' ? 'badge-accent' : 'badge-ghost'">{{ feature.category }}</span>
                      <span v-if="feature.isLicenseLocked" class="badge badge-soft badge-sm badge-neutral">Locked by license</span>
                      <span v-if="feature.dependsOnLabels.length" class="badge badge-soft badge-sm badge-info">Requires {{ feature.dependsOnLabels.join(', ') }}</span>
                      <span v-if="feature.isBlockedByDependencies" class="badge badge-soft badge-sm badge-warning">Blocked by {{ feature.blockedByLabels.join(', ') }}</span>
                      <span v-else-if="!feature.isExplicitlyEnabled" class="badge badge-soft badge-sm">Disabled</span>
                      <span v-else class="badge badge-soft badge-sm badge-success">Enabled</span>
                    </div>
                    <p class="text-xs text-base-content/60 mt-1 leading-relaxed">{{ feature.description }}</p>
                    <p v-if="feature.isLicenseLocked" class="mt-2 text-xs leading-6 text-base-content/55">Nilai modul ini mengikuti license aktif di CMS dan tidak bisa diubah manual dari panel ini.</p>
                    <p v-if="feature.isBlockedByDependencies" class="mt-2 text-xs leading-6 text-warning/90">This module is checked, but it will stay unavailable until its parent modules are enabled.</p>
                  </div>
                </div>
                <div v-if="!filteredFeatureEntries.length" class="rounded-xl border border-dashed border-base-300 px-5 py-10 text-center text-sm text-base-content/45">
                  No feature modules found for this category filter.
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

          <div class="card bg-base-100 border border-base-300">
            <div class="card-body">
              <div class="flex items-start justify-between gap-4 mb-4 border-b border-base-200 pb-4">
                <div>
                  <h2 class="font-semibold text-sm uppercase tracking-wide text-base-content/50">Business Seeds</h2>
                  <p class="text-xs text-base-content/50 mt-1 max-w-xl">Non-destructive demo seeders for each business type. They update core settings, default sections, and starter content so you can switch demo modes without using the terminal.</p>
                </div>
                <span class="badge badge-soft badge-secondary">Superadmin Only</span>
              </div>

              <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div class="rounded-xl border border-base-200 bg-base-200/20 p-5">
                  <h3 class="font-semibold text-base-content">Jewelry Demo</h3>
                  <p class="mt-2 text-sm leading-7 text-base-content/60">Seeds jewelry site settings, classic sections, sample collections, starter products, testimonials, and a blog article.</p>
                  <button type="button" class="btn btn-sm btn-primary mt-4" :disabled="seedLoading === 'jewelry'" @click="runBusinessSeed('jewelry')">
                    {{ seedLoading === 'jewelry' ? 'Seeding...' : 'Seed Jewelry Demo' }}
                  </button>
                </div>

                <div class="rounded-xl border border-base-200 bg-base-200/20 p-5">
                  <h3 class="font-semibold text-base-content">Guesthouse Demo</h3>
                  <p class="mt-2 text-sm leading-7 text-base-content/60">Seeds guesthouse settings, retreat sections, featured room types, room units, and guest reviews. The public booking page will use these featured room types.</p>
                  <button type="button" class="btn btn-sm btn-secondary text-primary mt-4" :disabled="seedLoading === 'guesthouse'" @click="runBusinessSeed('guesthouse')">
                    {{ seedLoading === 'guesthouse' ? 'Seeding...' : 'Seed Guesthouse Demo' }}
                  </button>
                </div>

                <div class="rounded-xl border border-base-200 bg-base-200/20 p-5">
                  <h3 class="font-semibold text-base-content">CCTV &amp; Networking Demo</h3>
                  <p class="mt-2 text-sm leading-7 text-base-content/60">Seeds service-business settings, CCTV/network sections, coverage CTA, and starter testimonials for a technical services landing page.</p>
                  <button type="button" class="btn btn-sm btn-accent mt-4" :disabled="seedLoading === 'cctv'" @click="runBusinessSeed('cctv')">
                    {{ seedLoading === 'cctv' ? 'Seeding...' : 'Seed CCTV Demo' }}
                  </button>
                </div>
              </div>

              <p v-if="seedMessage" class="mt-4 text-sm text-success">{{ seedMessage }}</p>
              <p v-if="seedError" class="mt-2 text-sm text-error">{{ seedError }}</p>
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
  IconAlertCircle,
  IconArrowRight,
  IconBug,
  IconCheck,
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
  IconTrash,
  IconTruck,
  IconX,
} from '@tabler/icons-vue'
import { useAdminDateFormat } from '~/composables/useAdminDateFormat'
import { THEME_DEFAULTS, FONT_OPTIONS } from '~/composables/useTheme'
import { FEATURES, isFeatureEnabled } from '~/composables/usePlan'
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
const activeTab = ref<string>('general');
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
  if (!mediaLibraryEnabled.value) return
  await loadMedia()
  showLogoPicker.value = true
}

function pickLogo(url: string) {
  form.value.logoUrl = url
  showLogoPicker.value = false
}

const { data: settings, refresh: refreshSettings } = await useFetch<Record<string, string>>('/api/settings', {
  key: 'site-settings',
})
const { data: liveRate } = useFetch<{ IDR: number; source: string }>('/api/exchange-rate')
const { formatAdminDateTime } = useAdminDateFormat()
const route = useRoute()
const saving = ref(false)
const savingFeatures = ref(false)
const licenseActionLoading = ref(false)
const licenseUnbindLoading = ref(false)
const seedLoading = ref<string | null>(null)
const seedMessage = ref('')
const seedError = ref('')

interface LicenseValidationState {
  status: '' | 'valid' | 'expired' | 'inactive' | 'invalid'
  message: string
  features: string[]
  plan: string
  lastValidatedAt: string
  expiresAt: string
}

interface FeatureEntry {
  name: string
  key: string
  label: string
  description: string
  category: string
  dependsOnLabels: string[]
  blockedByLabels: string[]
  isExplicitlyEnabled: boolean
  isEnabled: boolean
  isBlockedByDependencies: boolean
  isLicenseLocked: boolean
}

const LICENSED_FEATURE_KEY_MAP = {
  media: ['featureMediaLibrary'],
  shop: ['featureShop', 'featureCart'],
  blog: ['featureBlog'],
  booking: ['featureRoomInventory', 'featureBookingEngine'],
} as const

const LICENSE_CONTROLLED_KEYS = new Set<string>(Object.values(LICENSED_FEATURE_KEY_MAP).flat())

const selectedFeatureCategory = ref<'All' | 'Core' | 'Jewelry' | 'Guesthouse'>('All')

function createFeatureState(source?: Record<string, string> | null): Record<string, string> {
  return Object.fromEntries(
    Object.values(FEATURES).map(feature => [feature.key, source?.[feature.key] ?? feature.defaultValue]),
  )
}

function createFormState(source?: Record<string, string> | null): Record<string, string> {
  return {
    businessType: source?.businessType || 'jewelry',
    templateKey: source?.templateKey || DEFAULT_TEMPLATE_KEY,
    draftTemplateKey: source?.draftTemplateKey || '',
    draftBusinessType: source?.draftBusinessType || '',
    siteName: source?.siteName || 'Sense of Jewels',
    siteTagline: source?.siteTagline || '',
    siteUrl: source?.siteUrl || '',
    licenseKey: source?.licenseKey || '',
    licensePlan: source?.licensePlan || '',
    licenseStatus: source?.licenseStatus || '',
    licenseLastValidatedAt: source?.licenseLastValidatedAt || '',
    licenseFeatures: source?.licenseFeatures || '',
    licenseExpiresAt: source?.licenseExpiresAt || '',
    licenseStatusMessage: source?.licenseStatusMessage || '',
    contactEmail: source?.contactEmail || '',
    contactPhone: source?.contactPhone || '',
    address: source?.address || '',
    instagramUrl: source?.instagramUrl || '',
    whatsappNumber: source?.whatsappNumber || '',
    logoUrl: source?.logoUrl || '',
    colorPrimary: source?.colorPrimary || THEME_DEFAULTS.colorPrimary,
    colorPrimaryContent: source?.colorPrimaryContent || THEME_DEFAULTS.colorPrimaryContent,
    colorSecondary: source?.colorSecondary || THEME_DEFAULTS.colorSecondary,
    colorAccent: source?.colorAccent || THEME_DEFAULTS.colorAccent,
    colorBase100: source?.colorBase100 || THEME_DEFAULTS.colorBase100,
    colorBaseContent: source?.colorBaseContent || THEME_DEFAULTS.colorBaseContent,
    fontHeading: source?.fontHeading ?? THEME_DEFAULTS.fontHeading,
    fontBody: source?.fontBody ?? THEME_DEFAULTS.fontBody,
    metaDescription: source?.metaDescription || '',
    metaKeywords: source?.metaKeywords || '',
    ogImage: source?.ogImage || '',
    googleAnalyticsId: source?.googleAnalyticsId || '',
    ...createFeatureState(source),
    shippingOriginCityId: source?.shippingOriginCityId || '',
    shippingOriginCityName: source?.shippingOriginCityName || '',
    shippingCouriers: source?.shippingCouriers || 'jne,tiki,pos',
    shippingDefaultWeight: source?.shippingDefaultWeight || '500',
  }
}

function normalizeLicenseStatus(value?: string | null): LicenseValidationState['status'] {
  const normalized = String(value || '').trim().toLowerCase()

  if (
    normalized === 'valid'
    || normalized === 'expired'
    || normalized === 'inactive'
    || normalized === 'invalid'
  ) {
    return normalized
  }

  return ''
}

function defaultLicenseStatusMessage(status: LicenseValidationState['status'], source?: Record<string, string> | null) {
  if (status === 'valid') {
    return `Stored license plan: ${source?.licensePlan || '-'}`
  }

  if (status === 'expired') {
    return source?.licenseExpiresAt
      ? `Stored license expired on ${formatAdminDateTime(source.licenseExpiresAt)}.`
      : 'Stored license has expired.'
  }

  if (status === 'inactive') {
    return 'Stored license is inactive and admin access is limited to recovery actions.'
  }

  if (status === 'invalid') {
    return source?.licenseKey
      ? 'Stored license key is invalid. Update the key and revalidate to restore licensed features.'
      : 'No active CMS license is currently bound.'
  }

  return ''
}

function buildLicenseValidationState(source?: Record<string, string> | null, fallbackMessage?: string): LicenseValidationState {
  const status = normalizeLicenseStatus(source?.licenseStatus)

  return {
    status,
    message: fallbackMessage || source?.licenseStatusMessage || defaultLicenseStatusMessage(status, source),
    features: source?.licenseFeatures?.split(',').map(item => item.trim()).filter(Boolean) || [],
    plan: source?.licensePlan || '',
    lastValidatedAt: source?.licenseLastValidatedAt || '',
    expiresAt: source?.licenseExpiresAt || '',
  }
}

function licenseStatusBadgeClass(status: LicenseValidationState['status']) {
  if (status === 'valid') return 'badge-success'
  if (status === 'expired') return 'badge-warning'
  if (status === 'inactive') return 'badge-error'
  if (status === 'invalid') return 'badge-error'
  return 'badge-ghost'
}

function licenseStatusPanelClass(status: LicenseValidationState['status']) {
  if (!status) return 'border-base-300 bg-base-100 text-base-content/70'
  if (status === 'valid') return 'border-success/30 bg-success/5 text-success'
  if (status === 'expired') return 'border-warning/30 bg-warning/5 text-warning'
  if (status === 'inactive') return 'border-error/30 bg-error/5 text-error'
  return 'border-error/30 bg-error/5 text-error'
}

async function saveFeatures() {
  savingFeatures.value = true
  try {
    await $fetch('/api/settings', {
      method: 'PUT',
      body: createFeatureState(form.value),
    })
  } finally {
    savingFeatures.value = false
  }
}

useTheme(settings)

const form = ref<Record<string, string>>(createFormState(settings.value))
const licenseValidation = ref<LicenseValidationState>(buildLicenseValidationState(settings.value))
const mediaLibraryEnabled = computed(() => plan.hasFeature('mediaLibrary'))
const derivedLicenseDomain = computed(() => {
  const raw = form.value.siteUrl?.trim()

  if (!raw) {
    return ''
  }

  try {
    return new URL(raw).hostname.replace(/^www\./, '').toLowerCase()
  }
  catch {
    return raw.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '').toLowerCase()
  }
})
const licenseValidationLastDate = computed(() => licenseValidation.value.lastValidatedAt || form.value.licenseLastValidatedAt || '')
const licenseValidationLastLabel = computed(() => licenseValidationLastDate.value ? formatAdminDateTime(licenseValidationLastDate.value) : 'Never tested')
const licenseRecoveryNotice = computed(() => {
  const queryStatus = normalizeLicenseStatus(String(route.query.license || ''))
  const effectiveStatus = queryStatus || normalizeLicenseStatus(form.value.licenseStatus)

  if (!effectiveStatus || effectiveStatus === 'valid') {
    return ''
  }

  if (effectiveStatus === 'invalid') {
    return 'CMS license is invalid. Licensed features have been revoked. Update the key below and run revalidation to restore access.'
  }

  if (effectiveStatus === 'expired') {
    return 'CMS license has expired. Licensed features have been revoked. Update or renew the license and revalidate to restore access.'
  }

  return 'CMS license is inactive. Licensed features have been revoked. Activate the license and revalidate to restore access.'
})
const licenseControlledKeys = computed(() => normalizeLicenseStatus(form.value.licenseStatus) === 'valid'
  ? LICENSE_CONTROLLED_KEYS
  : new Set<string>())
const featureCategoryFilters = ['All', 'Core', 'Jewelry', 'Guesthouse'] as const
const featureEntries = computed<FeatureEntry[]>(() => (Object.entries(FEATURES) as Array<[keyof typeof FEATURES, (typeof FEATURES)[keyof typeof FEATURES]]>)
  .map(([name, feature]) => {
    const dependencies = (feature as { dependsOn?: Array<keyof typeof FEATURES> }).dependsOn ?? []
    const blockedDependencies = dependencies.filter(dependency => !isFeatureEnabled(form.value, dependency))
    const isExplicitlyEnabled = form.value[feature.key] !== 'false'
    const isEnabled = isFeatureEnabled(form.value, name)

    return {
      name,
      key: feature.key,
      label: feature.label,
      description: feature.description,
      category: feature.category,
      dependsOnLabels: dependencies.map(dependency => FEATURES[dependency].label),
      blockedByLabels: blockedDependencies.map(dependency => FEATURES[dependency].label),
      isExplicitlyEnabled,
      isEnabled,
      isBlockedByDependencies: isExplicitlyEnabled && !isEnabled && blockedDependencies.length > 0,
      isLicenseLocked: licenseControlledKeys.value.has(feature.key),
    }
  })
  .sort((left, right) => {
    const categoryOrder = ['Core', 'Jewelry', 'Guesthouse']
    const categoryDelta = categoryOrder.indexOf(left.category) - categoryOrder.indexOf(right.category)
    if (categoryDelta !== 0) return categoryDelta
    return left.label.localeCompare(right.label)
  }))
const filteredFeatureEntries = computed(() => selectedFeatureCategory.value === 'All'
  ? featureEntries.value
  : featureEntries.value.filter(feature => feature.category === selectedFeatureCategory.value))
const licenseSummary = computed(() => ({
  active: featureEntries.value.filter(feature => feature.isEnabled).length,
  explicitlyDisabled: featureEntries.value.filter(feature => !feature.isExplicitlyEnabled).length,
  dependencyBlocked: featureEntries.value.filter(feature => feature.isBlockedByDependencies).length,
}))
const categorySummaries = computed(() => featureCategoryFilters
  .filter(category => category !== 'All')
  .map((category) => {
    const entries = featureEntries.value.filter(feature => feature.category === category)
    const active = entries.filter(feature => feature.isEnabled).length

    return {
      name: category,
      total: entries.length,
      active,
      enabledLabel: `${active} active, ${entries.length - active} unavailable`,
    }
  }))
const currentBusinessType = computed<BusinessType>(() => (form.value.businessType as BusinessType) || 'jewelry')
const settingsSubtitle = computed(() => {
  if (currentBusinessType.value === 'guesthouse') {
    return 'Property profile, booking contact, branding, and guest-facing configuration'
  }

  if (currentBusinessType.value === 'cctv') {
    return 'Service profile, operational coverage, branding, and client-facing contact configuration'
  }

  return 'Global site properties & configuration'
})
const siteUrlPlaceholder = computed(() => {
  if (currentBusinessType.value === 'guesthouse') return 'https://yourguesthouse.com'
  if (currentBusinessType.value === 'cctv') return 'https://tech.pebblesbali.com'
  return 'https://senseofjewels.com'
})
const metaKeywordsPlaceholder = computed(() => {
  if (currentBusinessType.value === 'guesthouse') return 'guesthouse bali, room rent bali, boutique stay, villa room'
  if (currentBusinessType.value === 'cctv') return 'cctv bali, instalasi cctv, jaringan kantor, wifi kantor'
  return 'jewelry, bali, necklace'
})

const businessTypeOptions = BUSINESS_TYPE_OPTIONS
const templateOptions = computed(() => {
  const options = getTemplateOptionsForBusinessType((form.value.businessType as BusinessType) || 'jewelry')
  return options.length ? options : getTemplateOptionsForBusinessType('jewelry')
})
const selectedTemplateOption = computed(() => templateOptions.value.find(option => option.key === form.value.templateKey) || templateOptions.value[0] || null)
const draftPreviewHref = computed(() => {
  if (!form.value.draftTemplateKey) return '/'
  const params = new URLSearchParams()
  params.set('previewTemplate', form.value.draftTemplateKey)
  params.set('previewBusinessType', form.value.draftBusinessType || form.value.businessType || 'jewelry')
  params.set('previewMode', 'draft')

  return `/?${params.toString()}`
})

watch(settings, (nextSettings) => {
  form.value = createFormState(nextSettings || undefined)
  licenseValidation.value = buildLicenseValidationState(nextSettings || undefined)
}, { immediate: true })

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

originCitySearch.value = settings.value?.shippingOriginCityName || ''

async function save() {
  saving.value = true
  try {
    await $fetch('/api/settings', { method: 'PUT', body: form.value })
    await refreshSettings()
    await refreshNuxtData('site-settings')
    form.value = createFormState(settings.value)
    originCitySearch.value = settings.value?.shippingOriginCityName || ''
  } finally {
    saving.value = false
  }
}

async function validateCmsLicense(applyFeatures: boolean) {
  licenseActionLoading.value = true

  try {
    const result = await $fetch<{
      valid: boolean
      licenseStatus: 'valid'
      plan: string
      planName: string
      features: string[]
      expiresAt: string | null
      domain: string
      appliedFeatures: boolean
    }>('/api/settings/license', {
      method: 'POST',
      body: {
        licenseKey: form.value.licenseKey,
        domain: derivedLicenseDomain.value,
        applyFeatures,
      },
    })

    await refreshSettings()
    await refreshNuxtData('site-settings')
    form.value = createFormState(settings.value)
    originCitySearch.value = settings.value?.shippingOriginCityName || ''
    licenseValidation.value = buildLicenseValidationState(settings.value, applyFeatures
      ? `License valid. Plan ${result.planName} applied to CMS features.`
      : `License valid for ${result.domain} on ${result.planName}.`)
  }
  catch (error: any) {
    await refreshSettings()
    await refreshNuxtData('site-settings')
    form.value = createFormState(settings.value)
    originCitySearch.value = settings.value?.shippingOriginCityName || ''
    licenseValidation.value = buildLicenseValidationState(
      settings.value,
      settings.value?.licenseStatusMessage || error?.data?.statusMessage || error?.statusMessage || 'License validation failed',
    )
  }
  finally {
    licenseActionLoading.value = false
  }
}

async function clearCmsLicense() {
  licenseUnbindLoading.value = true

  try {
    await $fetch('/api/settings/license', {
      method: 'DELETE',
    })

    await refreshSettings()
    await refreshNuxtData('site-settings')
    form.value = createFormState(settings.value)
    originCitySearch.value = settings.value?.shippingOriginCityName || ''
    licenseValidation.value = {
      status: '',
      message: 'License binding cleared from CMS settings.',
      features: [],
      plan: '',
      lastValidatedAt: '',
      expiresAt: '',
    }
  }
  catch (error: any) {
    await refreshSettings()
    await refreshNuxtData('site-settings')
    form.value = createFormState(settings.value)
    originCitySearch.value = settings.value?.shippingOriginCityName || ''
    licenseValidation.value = buildLicenseValidationState(
      settings.value,
      error?.data?.statusMessage || error?.statusMessage || 'Failed to clear license binding',
    )
  }
  finally {
    licenseUnbindLoading.value = false
  }
}

async function runBusinessSeed(businessType: 'jewelry' | 'guesthouse' | 'cctv') {
  seedLoading.value = businessType
  seedMessage.value = ''
  seedError.value = ''
  try {
    const result = await $fetch<{ message: string }>('/api/settings/seed', {
      method: 'POST',
      body: { businessType },
    })
    await refreshSettings()
    await refreshNuxtData('site-settings')
    form.value = createFormState(settings.value)
    seedMessage.value = result.message
  } catch (error: any) {
    seedError.value = error?.data?.statusMessage || 'Failed to run business seed'
  } finally {
    seedLoading.value = null
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
  return formatAdminDateTime(iso)
}

function formatRateIdr(value: number) {
  const rounded = Math.round(Number(value || 0))
  return rounded
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function formatBackupSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(2)} MB`
}

onMounted(() => fetchBackups())
</script>

<style scoped>
.settings-menu :deep(a) {
  border: 1px solid transparent;
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

.settings-menu :deep(a.active),
.settings-menu :deep(a.active:hover),
.settings-menu :deep(a.active:focus-visible) {
  background-color: color-mix(in oklab, var(--color-base-200) 84%, white);
  border-color: color-mix(in oklab, var(--color-base-300) 88%, transparent);
  color: var(--color-base-content);
  box-shadow: none;
}

.settings-menu :deep(a:hover) {
  background-color: color-mix(in oklab, var(--color-base-200) 62%, white);
  color: var(--color-base-content);
}

.settings-menu :deep(a:focus-visible) {
  outline: none;
  border-color: color-mix(in oklab, var(--color-base-content) 12%, transparent);
}
</style>
