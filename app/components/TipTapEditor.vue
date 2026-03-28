<template>
  <div class="tiptap-editor border border-base-300 rounded-lg overflow-hidden bg-base-100">
    <!-- Toolbar -->
    <div v-if="editor" class="tiptap-toolbar flex flex-wrap gap-0.5 p-1.5 border-b border-base-300 bg-base-200/60">

      <!-- History -->
      <div class="tiptap-group">
        <TipTapBtn title="Undo" :disabled="!editor.can().undo()" @click="editor.chain().focus().undo().run()">
          <IconArrowBackUp class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Redo" :disabled="!editor.can().redo()" @click="editor.chain().focus().redo().run()">
          <IconArrowForwardUp class="w-4 h-4" />
        </TipTapBtn>
      </div>

      <div class="tiptap-divider" />

      <!-- Headings + Paragraph -->
      <div class="tiptap-group">
        <TipTapBtn title="Paragraph" :active="editor.isActive('paragraph')" @click="editor.chain().focus().setParagraph().run()">
          <IconPilcrow class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Heading 1" :active="editor.isActive('heading', { level: 1 })" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">
          <IconH1 class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Heading 2" :active="editor.isActive('heading', { level: 2 })" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
          <IconH2 class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Heading 3" :active="editor.isActive('heading', { level: 3 })" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
          <IconH3 class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Heading 4" :active="editor.isActive('heading', { level: 4 })" @click="editor.chain().focus().toggleHeading({ level: 4 }).run()">
          <IconH4 class="w-4 h-4" />
        </TipTapBtn>
      </div>

      <div class="tiptap-divider" />

      <!-- Inline marks -->
      <div class="tiptap-group">
        <TipTapBtn title="Bold" :active="editor.isActive('bold')" @click="editor.chain().focus().toggleBold().run()">
          <IconBold class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Italic" :active="editor.isActive('italic')" @click="editor.chain().focus().toggleItalic().run()">
          <IconItalic class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Underline" :active="editor.isActive('underline')" @click="editor.chain().focus().toggleUnderline().run()">
          <IconUnderline class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Strikethrough" :active="editor.isActive('strike')" @click="editor.chain().focus().toggleStrike().run()">
          <IconStrikethrough class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Subscript" :active="editor.isActive('subscript')" @click="editor.chain().focus().toggleSubscript().run()">
          <IconSubscript class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Superscript" :active="editor.isActive('superscript')" @click="editor.chain().focus().toggleSuperscript().run()">
          <IconSuperscript class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Highlight" :active="editor.isActive('highlight')" @click="editor.chain().focus().toggleHighlight().run()">
          <IconHighlight class="w-4 h-4" />
        </TipTapBtn>
      </div>

      <div class="tiptap-divider" />

      <!-- Text Alignment -->
      <div class="tiptap-group">
        <TipTapBtn title="Align Left" :active="editor.isActive({ textAlign: 'left' })" @click="editor.chain().focus().setTextAlign('left').run()">
          <IconAlignLeft class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Align Center" :active="editor.isActive({ textAlign: 'center' })" @click="editor.chain().focus().setTextAlign('center').run()">
          <IconAlignCenter class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Align Right" :active="editor.isActive({ textAlign: 'right' })" @click="editor.chain().focus().setTextAlign('right').run()">
          <IconAlignRight class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Justify" :active="editor.isActive({ textAlign: 'justify' })" @click="editor.chain().focus().setTextAlign('justify').run()">
          <IconAlignJustified class="w-4 h-4" />
        </TipTapBtn>
      </div>

      <div class="tiptap-divider" />

      <!-- Lists -->
      <div class="tiptap-group">
        <TipTapBtn title="Bullet List" :active="editor.isActive('bulletList')" @click="editor.chain().focus().toggleBulletList().run()">
          <IconList class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Ordered List" :active="editor.isActive('orderedList')" @click="editor.chain().focus().toggleOrderedList().run()">
          <IconListNumbers class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Task List" :active="editor.isActive('taskList')" @click="editor.chain().focus().toggleTaskList().run()">
          <IconListCheck class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Outdent" @click="editor.chain().focus().liftListItem('listItem').run()">
          <IconIndentDecrease class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Indent" @click="editor.chain().focus().sinkListItem('listItem').run()">
          <IconIndentIncrease class="w-4 h-4" />
        </TipTapBtn>
      </div>

      <div class="tiptap-divider" />

      <!-- Blocks -->
      <div class="tiptap-group">
        <TipTapBtn title="Blockquote" :active="editor.isActive('blockquote')" @click="editor.chain().focus().toggleBlockquote().run()">
          <IconBlockquote class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Code Block" :active="editor.isActive('codeBlock')" @click="editor.chain().focus().toggleCodeBlock().run()">
          <IconCode class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Inline Code" :active="editor.isActive('code')" @click="editor.chain().focus().toggleCode().run()">
          <IconTerminal2 class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Horizontal Rule" @click="editor.chain().focus().setHorizontalRule().run()">
          <IconSeparator class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Hard Break" @click="editor.chain().focus().setHardBreak().run()">
          <IconCornerDownLeft class="w-4 h-4" />
        </TipTapBtn>
      </div>

      <div class="tiptap-divider" />

      <!-- Link -->
      <div class="tiptap-group">
        <TipTapBtn title="Insert / Edit Link" :active="editor.isActive('link')" @click="openLinkModal">
          <IconLink class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Remove Link" :disabled="!editor.isActive('link')" @click="editor.chain().focus().unsetLink().run()">
          <IconLinkOff class="w-4 h-4" />
        </TipTapBtn>
      </div>

      <div class="tiptap-divider" />

      <!-- Image -->
      <div class="tiptap-group">
        <TipTapBtn title="Insert Image URL" @click="openImageModal">
          <IconPhoto class="w-4 h-4" />
        </TipTapBtn>
      </div>

      <div class="tiptap-divider" />

      <!-- Table -->
      <div class="tiptap-group">
        <TipTapBtn title="Insert Table" @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()">
          <IconTable class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Add Column Before" :disabled="!editor.can().addColumnBefore()" @click="editor.chain().focus().addColumnBefore().run()">
          <IconColumnInsertLeft class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Add Column After" :disabled="!editor.can().addColumnAfter()" @click="editor.chain().focus().addColumnAfter().run()">
          <IconColumnInsertRight class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Delete Column" :disabled="!editor.can().deleteColumn()" @click="editor.chain().focus().deleteColumn().run()">
          <IconColumnRemove class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Add Row Before" :disabled="!editor.can().addRowBefore()" @click="editor.chain().focus().addRowBefore().run()">
          <IconRowInsertTop class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Add Row After" :disabled="!editor.can().addRowAfter()" @click="editor.chain().focus().addRowAfter().run()">
          <IconRowInsertBottom class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Delete Row" :disabled="!editor.can().deleteRow()" @click="editor.chain().focus().deleteRow().run()">
          <IconRowRemove class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Delete Table" :disabled="!editor.can().deleteTable()" @click="editor.chain().focus().deleteTable().run()">
          <IconTableOff class="w-4 h-4" />
        </TipTapBtn>
        <TipTapBtn title="Merge/Split Cells" @click="editor.can().mergeCells() ? editor.chain().focus().mergeCells().run() : editor.chain().focus().splitCell().run()">
          <IconLayoutColumns class="w-4 h-4" />
        </TipTapBtn>
      </div>

      <div class="tiptap-divider" />

      <div v-if="editor" class="tiptap-group items-center">
        <label title="Text Color" class="tiptap-btn cursor-pointer relative">
          <IconLetterA class="w-4 h-4" />
          <input type="color" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" :value="currentColor"
            @input="e => editor!.chain().focus().setColor((e.target as HTMLInputElement).value).run()" />
        </label>
        <TipTapBtn title="Remove Color" @click="editor.chain().focus().unsetColor().run()">
          <IconLetterCaseToggle class="w-4 h-4" />
        </TipTapBtn>
      </div>

      <!-- Clear -->
      <div class="ml-auto tiptap-group">
        <TipTapBtn title="Clear Formatting" @click="editor.chain().focus().clearNodes().unsetAllMarks().run()">
          <IconClearFormatting class="w-4 h-4" />
        </TipTapBtn>
      </div>
    </div>

    <!-- Editor Content -->
    <EditorContent :editor="editor" class="tiptap-content" />

    <!-- Footer: char count -->
    <div v-if="editor" class="px-3 py-1.5 text-xs text-base-content/30 border-t border-base-300 flex justify-end bg-base-200/40">
      {{ charCount }} characters · {{ wordCount }} words
    </div>

    <!-- Link Modal -->
    <dialog ref="linkModalRef" class="modal">
      <div class="modal-box max-w-sm">
        <h3 class="font-bold text-sm mb-3">Insert Link</h3>
        <fieldset class="fieldset">
          <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">URL</legend>
          <input v-model="linkUrl" type="url" class="input input-sm w-full font-mono" placeholder="https://..." @keydown.enter.prevent="applyLink" />
        </fieldset>
        <div class="flex items-center gap-2 mt-2">
          <input v-model="linkOpenNewTab" type="checkbox" id="link-newtab" class="checkbox checkbox-sm checkbox-primary" />
          <label for="link-newtab" class="text-sm">Open in new tab</label>
        </div>
        <div class="modal-action">
          <button class="btn btn-ghost btn-sm" @click="linkModalRef?.close()">Cancel</button>
          <button class="btn btn-primary btn-sm" @click="applyLink">Apply</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop" @click="linkModalRef?.close()"><button>close</button></form>
    </dialog>

    <!-- Image Modal -->
    <dialog ref="imageModalRef" class="modal">
      <div class="modal-box max-w-sm">
        <h3 class="font-bold text-sm mb-3">Insert Image</h3>
        <fieldset class="fieldset">
          <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Image URL</legend>
          <input v-model="imageUrl" type="url" class="input input-sm w-full font-mono" placeholder="https://..." @keydown.enter.prevent="applyImage" />
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Alt text</legend>
          <input v-model="imageAlt" type="text" class="input input-sm w-full" placeholder="Image description..." />
        </fieldset>
        <div class="modal-action">
          <button class="btn btn-ghost btn-sm" @click="imageModalRef?.close()">Cancel</button>
          <button class="btn btn-primary btn-sm" @click="applyImage">Insert</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop" @click="imageModalRef?.close()"><button>close</button></form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import {
  IconArrowBackUp, IconArrowForwardUp,
  IconBold, IconItalic, IconUnderline, IconStrikethrough,
  IconSubscript, IconSuperscript, IconHighlight,
  IconAlignLeft, IconAlignCenter, IconAlignRight, IconAlignJustified,
  IconList, IconListNumbers, IconListCheck,
  IconIndentDecrease, IconIndentIncrease,
  IconBlockquote, IconCode, IconTerminal2, IconSeparator, IconCornerDownLeft,
  IconLink, IconLinkOff, IconPhoto,
  IconTable, IconTableOff,
  IconColumnInsertLeft, IconColumnInsertRight, IconColumnRemove,
  IconRowInsertTop, IconRowInsertBottom, IconRowRemove,
  IconLayoutColumns,
  IconLetterA, IconLetterCaseToggle,
  IconClearFormatting,
  IconH1, IconH2, IconH3, IconH4,
  IconPilcrow,
} from '@tabler/icons-vue'

// Sub-component
const TipTapBtn = defineComponent({
  props: {
    active: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    title: { type: String, default: '' },
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    return () => h(
      'button',
      {
        type: 'button',
        title: props.title,
        disabled: props.disabled,
        class: [
          'tiptap-btn',
          props.active ? 'tiptap-btn-active' : '',
          props.disabled ? 'opacity-30 cursor-not-allowed' : '',
        ].join(' '),
        onClick: (e: MouseEvent) => { e.preventDefault(); if (!props.disabled) emit('click') },
      },
      slots.default?.()
    )
  },
})

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const linkModalRef = ref<HTMLDialogElement>()
const imageModalRef = ref<HTMLDialogElement>()
const linkUrl = ref('')
const linkOpenNewTab = ref(true)
const imageUrl = ref('')
const imageAlt = ref('')

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4, 5, 6] },
    }),
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    Typography,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
    Image.configure({ inline: false }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    Subscript,
    Superscript,
    TaskList,
    TaskItem.configure({ nested: true }),
    CharacterCount,
    Placeholder.configure({ placeholder: props.placeholder || 'Start writing...' }),
  ],
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML())
  },
})

// Sync external model changes (e.g. when loading edit form)
watch(() => props.modelValue, (val) => {
  if (!editor.value) return
  if (editor.value.getHTML() === val) return
  editor.value.commands.setContent(val || '')
})

onBeforeUnmount(() => editor.value?.destroy())

const charCount = computed(() => editor.value?.storage.characterCount.characters() ?? 0)
const wordCount = computed(() => editor.value?.storage.characterCount.words() ?? 0)
const currentColor = computed(() => {
  if (!editor.value) return '#000000'
  return (editor.value.getAttributes('textStyle').color as string) || '#000000'
})

function openLinkModal() {
  linkUrl.value = editor.value?.getAttributes('link').href ?? ''
  linkOpenNewTab.value = editor.value?.getAttributes('link').target === '_blank'
  linkModalRef.value?.showModal()
}

function applyLink() {
  if (!linkUrl.value) {
    editor.value?.chain().focus().unsetLink().run()
  } else {
    editor.value?.chain().focus().setLink({
      href: linkUrl.value,
      target: linkOpenNewTab.value ? '_blank' : '_self',
    }).run()
  }
  linkModalRef.value?.close()
}

function openImageModal() {
  imageUrl.value = ''
  imageAlt.value = ''
  imageModalRef.value?.showModal()
}

function applyImage() {
  if (imageUrl.value) {
    editor.value?.chain().focus().setImage({ src: imageUrl.value, alt: imageAlt.value }).run()
  }
  imageModalRef.value?.close()
}
</script>

<style>
/* Toolbar button styles */
.tiptap-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
  color: oklch(var(--color-base-content) / 0.7);
  transition: background 0.1s, color 0.1s;
}
.tiptap-btn:hover:not(:disabled) {
  background: oklch(var(--color-base-300));
  color: oklch(var(--color-base-content));
}
.tiptap-btn-active {
  background: oklch(var(--color-primary));
  color: oklch(var(--color-primary-content));
}
.tiptap-btn-active:hover:not(:disabled) {
  background: oklch(var(--color-primary));
}
.tiptap-group {
  display: flex;
  align-items: center;
  gap: 0.125rem;
}
.tiptap-divider {
  width: 1px;
  height: 1.5rem;
  background: oklch(var(--color-base-300));
  margin: 0 0.25rem;
}

/* Editor content area */
.tiptap-content .ProseMirror {
  min-height: 280px;
  padding: 1rem;
  outline: none;
  font-size: 0.9rem;
  line-height: 1.75;
  color: oklch(var(--color-base-content));
}
.tiptap-content .ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: oklch(var(--color-base-content) / 0.3);
  pointer-events: none;
  height: 0;
}

/* Prose styles inside editor */
.tiptap-content .ProseMirror h1 { font-size: 1.875rem; font-weight: 700; margin: 1rem 0 0.5rem; }
.tiptap-content .ProseMirror h2 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; }
.tiptap-content .ProseMirror h3 { font-size: 1.25rem; font-weight: 600; margin: 0.875rem 0 0.375rem; }
.tiptap-content .ProseMirror h4 { font-size: 1.125rem; font-weight: 600; margin: 0.75rem 0 0.25rem; }
.tiptap-content .ProseMirror p { margin: 0.25rem 0; }
.tiptap-content .ProseMirror strong { font-weight: 700; }
.tiptap-content .ProseMirror em { font-style: italic; }
.tiptap-content .ProseMirror u { text-decoration: underline; }
.tiptap-content .ProseMirror s { text-decoration: line-through; }
.tiptap-content .ProseMirror a { color: oklch(var(--color-primary)); text-decoration: underline; cursor: pointer; }
.tiptap-content .ProseMirror mark { background: #fef08a; border-radius: 0.125rem; padding: 0 0.125rem; }
.tiptap-content .ProseMirror code { background: oklch(var(--color-base-200)); padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.85em; }
.tiptap-content .ProseMirror pre { background: oklch(var(--color-neutral)); color: oklch(var(--color-neutral-content)); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 0.75rem 0; }
.tiptap-content .ProseMirror pre code { background: none; padding: 0; font-size: 0.875em; }
.tiptap-content .ProseMirror blockquote { border-left: 3px solid oklch(var(--color-secondary)); padding-left: 1rem; color: oklch(var(--color-base-content) / 0.7); margin: 0.75rem 0; font-style: italic; }
.tiptap-content .ProseMirror hr { border: none; border-top: 1px solid oklch(var(--color-base-300)); margin: 1rem 0; }
.tiptap-content .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.25rem 0; }
.tiptap-content .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.25rem 0; }
.tiptap-content .ProseMirror li { margin: 0.125rem 0; }
.tiptap-content .ProseMirror img { max-width: 100%; height: auto; border-radius: 0.375rem; margin: 0.5rem 0; }

/* Task list */
.tiptap-content .ProseMirror ul[data-type="taskList"] { list-style: none; padding-left: 0.25rem; }
.tiptap-content .ProseMirror ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 0.5rem; }
.tiptap-content .ProseMirror ul[data-type="taskList"] li > label { margin-top: 0.2rem; }
.tiptap-content .ProseMirror ul[data-type="taskList"] li input[type="checkbox"] { width: 1rem; height: 1rem; cursor: pointer; }

/* Table */
.tiptap-content .ProseMirror table { border-collapse: collapse; width: 100%; margin: 0.75rem 0; }
.tiptap-content .ProseMirror table td,
.tiptap-content .ProseMirror table th { border: 1px solid oklch(var(--color-base-300)); padding: 0.5rem 0.75rem; min-width: 2rem; }
.tiptap-content .ProseMirror table th { background: oklch(var(--color-base-200)); font-weight: 600; text-align: left; }
.tiptap-content .ProseMirror table .selectedCell { background: oklch(var(--color-primary) / 0.1); }
.tiptap-content .ProseMirror .column-resize-handle { background-color: oklch(var(--color-primary)); bottom: 0; pointer-events: none; position: absolute; right: -2px; top: 0; width: 3px; }
.tiptap-content .ProseMirror .tableWrapper { overflow-x: auto; }
</style>
