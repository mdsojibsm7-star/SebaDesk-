import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Printer,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Superscript,
  Subscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Undo2,
  Redo2,
  FileText,
  BookmarkPlus,
  RotateCcw,
  FilePlus2,
  Check,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Table,
  Image as ImageIcon,
  Minus,
  Calendar,
  PenLine,
  Eraser,
  PanelRightClose,
  PanelRightOpen,
  Download,
  Palette,
  Highlighter,
} from 'lucide-react';

const DOC_DRAFT_KEY = 'utilitydesk_doc_draft_v2';

const TEMPLATES = [
  {
    id: 'leave-en',
    category: 'Leave Application',
    lang: 'English',
    title: 'Leave Application (Formal)',
    subtitle: '1-Page formal sick or casual leave request',
    pages: [
      {
        id: 'p1',
        html: `
          <p style="text-align: right;">Date: [DD Month YYYY]</p>
          <p>To,<br/>The [HR Manager / Principal / Head of Department]<br/>[Organization / Institution Name]<br/>[City / Address]</p>
          <p><strong>Subject: Application for [Sick / Casual] Leave for [Number] Day(s).</strong></p>
          <p>Dear Sir/Madam,</p>
          <p style="text-align: justify;">With due respect, I would like to inform you that I am currently unable to attend my regular duties due to [fever and medical rest / urgent personal matter]. On the advice of my physician, I need complete rest from <strong>[Start Date]</strong> to <strong>[End Date]</strong>.</p>
          <p style="text-align: justify;">During my absence, I have handed over my urgent responsibilities to [Colleague Name], and I will remain reachable via phone for any critical matters.</p>
          <p style="text-align: justify;">Therefore, I kindly request you to grant me <strong>[Number] day(s)</strong> of leave for the aforementioned period and oblige thereby.</p>
          <br/>
          <p>Sincerely yours,</p>
          <p><strong>[Your Full Name]</strong><br/>Designation / Class: [Your Role / Roll No]<br/>ID / Department: [Employee or Student ID]<br/>Phone: [01XXXXXXXXX]</p>
        `,
      },
    ],
  },
  {
    id: 'leave-bn',
    category: 'Leave Application',
    lang: 'বাংলা',
    title: 'ছুটির আবেদনপত্র (বাংলা)',
    subtitle: 'অসুস্থতা বা পারিবারিক কারণে দাপ্তরিক ছুটির দরখাস্ত',
    pages: [
      {
        id: 'p1',
        html: `
          <p style="text-align: right;">তারিখ: [দিন/মাস/সাল]</p>
          <p>বরাবর,<br/>[মাননীয় প্রধান শিক্ষক / ব্যবস্থাপক / বিভাগীয় প্রধান]<br/>[প্রতিষ্ঠানের নাম]<br/>[ঠিকানা ও জেলা]</p>
          <p><strong>বিষয়: [অসুস্থতাজনিত / জরুরি পারিবারিক] কারণে [সংখ্যা] দিনের ছুটির আবেদন।</strong></p>
          <p>জনাব,</p>
          <p style="text-align: justify;">বিনীত নিবেদন এই যে, আমি আপনার প্রতিষ্ঠানের [পদবি / শ্রেণি] হিসেবে কর্মরত/অধ্যয়নরত আছি। হঠাৎ [শারীরিক অসুস্থতা / জরুরি পারিবারিক প্রয়োজনে] আগামী <strong>[শুরুর তারিখ]</strong> হতে <strong>[শেষ তারিখ]</strong> পর্যন্ত মোট <strong>[সংখ্যা]</strong> দিন কর্মস্থলে/বিদ্যালয়ে উপস্থিত থাকা আমার পক্ষে সম্ভব নয়।</p>
          <p style="text-align: justify;">অতএব, অনুগ্রহপূর্বক আমাকে উক্ত [সংখ্যা] দিনের ছুটি মঞ্জুর করে বাধিত করতে আপনার মর্জি হয়।</p>
          <br/>
          <p>বিনীত নিবেদক,</p>
          <p><strong>[আপনার পূর্ণ নাম]</strong><br/>পদবি / শ্রেণি: [আপনার পদবি / রোল নম্বর]<br/>আইডি নম্বর: [আইডি]<br/>মোবাইল: [০১XXXXXXXXX]</p>
        `,
      },
    ],
  },
  {
    id: 'job-en',
    category: 'Job Application',
    lang: 'English',
    title: 'Job Application / Cover Letter',
    subtitle: 'Formal employment cover letter + enclosures',
    pages: [
      {
        id: 'p1',
        html: `
          <p style="text-align: right;">Date: [DD Month YYYY]</p>
          <p>To,<br/>The Head of Human Resources<br/>[Company / Organization Name]<br/>[Office Address, City]</p>
          <p><strong>Subject: Application for the post of "[Job Title / Position]".</strong></p>
          <p>Dear Sir/Madam,</p>
          <p style="text-align: justify;">In response to your recent job circular published in [Job Portal / Newspaper Name] on [Date], I am writing to express my strong interest in applying for the position of <strong>[Job Title]</strong> at your esteemed organization.</p>
          <p style="text-align: justify;">I have completed my [Degree Name] in [Subject] from [University Name]. Along with my academic foundation, I possess strong proficiency in [Key Skill 1, Key Skill 2, and Key Skill 3], which aligns directly with the requirements of this role.</p>
          <p style="text-align: justify;">I am confident that my dedication and problem-solving mindset will enable me to contribute positively to your team. My detailed Curriculum Vitae and supporting documents are enclosed herewith for your kind consideration.</p>
          <br/>
          <p>Yours faithfully,</p>
          <p><strong>[Your Full Name]</strong><br/>Mobile: [01XXXXXXXXX]<br/>Email: [your.email@example.com]</p>
          <hr/>
          <p><strong>Enclosures:</strong></p>
          <ol>
            <li>Updated Curriculum Vitae (CV) with passport-size photograph</li>
            <li>Photocopies of National ID (NID) and academic certificates</li>
          </ol>
        `,
      },
    ],
  },
  {
    id: 'job-bn',
    category: 'Job Application',
    lang: 'বাংলা',
    title: 'চাকরির আবেদনপত্র (বাংলা)',
    subtitle: 'নিয়োগ বিজ্ঞপ্তির বিপরীতে পূর্ণাঙ্গ চাকরির আবেদন',
    pages: [
      {
        id: 'p1',
        html: `
          <p style="text-align: right;">তারিখ: [দিন/মাস/সাল]</p>
          <p>বরাবর,<br/>[নিয়োগকারী কর্তৃপক্ষ / মহাপরিচালক / মানবসম্পদ বিভাগ]<br/>[প্রতিষ্ঠানের নাম]<br/>[কার্যালয়ের ঠিকানা]</p>
          <p><strong>বিষয়: "[পদের নাম]" পদে নিয়োগের জন্য আবেদন।</strong></p>
          <p>সূত্র: [পত্রিকা বা পোর্টালের নাম], প্রকাশিত তারিখ: [বিজ্ঞপ্তির তারিখ]।</p>
          <p>মহোদয়,</p>
          <p style="text-align: justify;">সবিনয় নিবেদন এই যে, উপর্যুক্ত সূত্রের নিয়োগ বিজ্ঞপ্তির মাধ্যমে জানতে পারলাম আপনার অধীনস্থ প্রতিষ্ঠানে <strong>"[পদের নাম]"</strong> পদে কিছু সংখ্যক যোগ্য জনবল নিয়োগ করা হবে। আমি উক্ত পদের একজন আগ্রহী ও যোগ্য প্রার্থী হিসেবে নিজেকে উপস্থাপন করছি।</p>
          <p style="text-align: justify;">আমি [বিশ্ববিদ্যালয়/বোর্ডের নাম] থেকে [সর্বশেষ ডিগ্রির নাম] সম্পন্ন করেছি এবং [দক্ষতা বা পূর্ব অভিজ্ঞতার বিবরণ] বিষয়ে বাস্তব দক্ষতা অর্জন করেছি। নিচে আমার প্রয়োজনীয় কাগজপত্র সংযুক্ত করা হলো।</p>
          <p style="text-align: justify;">অতএব, আমার শিক্ষাগত যোগ্যতা ও অভিজ্ঞতা বিবেচনা করে আমাকে উক্ত পদে নিয়োগ দানে আপনার সুদৃষ্টি কামনা করছি।</p>
          <br/>
          <p>বিনীত,</p>
          <p><strong>[আপনার পূর্ণ নাম]</strong><br/>মোবাইল: [০১XXXXXXXXX]<br/>ইমেইল: [example@email.com]</p>
          <hr/>
          <p><strong>সংযুক্তি সমূহ:</strong></p>
          <ol>
            <li>পূর্ণাঙ্গ জীবনবৃত্তান্ত (CV) ও সদ্য তোলা পাসপোর্ট সাইজ ছবি</li>
            <li>জাতীয় পরিচয়পত্র (NID) ও সকল শিক্ষাগত সনদের সত্যায়িত কপি</li>
          </ol>
        `,
      },
    ],
  },
  {
    id: 'cv-en-2page',
    category: 'CV Format',
    lang: 'English',
    title: '2-Page Professional CV (English)',
    subtitle: 'Multi-page Resume: Page 1 Profile & Experience, Page 2 Education & References',
    pages: [
      {
        id: 'p1',
        html: `
          <h1>[YOUR FULL NAME]</h1>
          <p style="color: #475569;">[House/Road, Area, City - Postal Code] &bull; Phone: [01XXXXXXXXX] &bull; Email: [name@email.com]</p>
          <hr/>
          <h2>CAREER OBJECTIVE</h2>
          <p style="text-align: justify;">Results-driven professional seeking a challenging role in a progressive organization where I can apply analytical problem-solving, operational leadership, and technical expertise to deliver measurable impact.</p>
          <h2>WORK EXPERIENCE</h2>
          <p><strong>[Senior Executive / Software Specialist]</strong> — [Company Name] <em>([Jan 2023] – [Present])</em></p>
          <ul>
            <li>Led cross-functional operations, workflow documentation, and client onboarding processes.</li>
            <li>Improved reporting accuracy and reduced turnaround time across key deliverables by 25%.</li>
            <li>Mentored junior team members and standardized monthly quality review checklists.</li>
          </ul>
          <p><strong>[Junior Officer / Intern]</strong> — [Previous Organization] <em>([Jun 2021] – [Dec 2022])</em></p>
          <ul>
            <li>Assisted department leads with data preparation, presentations, and stakeholder correspondence.</li>
            <li>Maintained digital archives and verified compliance documentation.</li>
          </ul>
          <h2>CORE COMPETENCIES</h2>
          <ul>
            <li><strong>Technical &amp; Office:</strong> Microsoft Word, Excel, PowerPoint, Digital Portal Operations</li>
            <li><strong>Communication:</strong> Fluent in English &amp; Bengali (Written, Presentation &amp; Reporting)</li>
            <li><strong>Soft Skills:</strong> Team Leadership, Time Management, Analytical Thinking</li>
          </ul>
        `,
      },
      {
        id: 'p2',
        html: `
          <h2>ACADEMIC QUALIFICATION</h2>
          <table>
            <thead>
              <tr>
                <th>Exam / Degree</th>
                <th>Subject / Group</th>
                <th>Board / University</th>
                <th>Year</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bachelor / Honours</td>
                <td>[Department Name]</td>
                <td>[University Name]</td>
                <td>[2021]</td>
                <td>[3.72 / 4.00]</td>
              </tr>
              <tr>
                <td>HSC / Alim</td>
                <td>[Science / Business]</td>
                <td>[Dhaka Board]</td>
                <td>[2017]</td>
                <td>[5.00 / 5.00]</td>
              </tr>
              <tr>
                <td>SSC / Dakhil</td>
                <td>[Science / Business]</td>
                <td>[Dhaka Board]</td>
                <td>[2015]</td>
                <td>[5.00 / 5.00]</td>
              </tr>
            </tbody>
          </table>
          <h2>TRAINING &amp; CERTIFICATIONS</h2>
          <ul>
            <li><strong>[Certification Title]</strong> — [Issuing Institute], [Year]</li>
            <li><strong>[Workshop / Vocational Course]</strong> — [Platform / Organization], [Year]</li>
          </ul>
          <h2>PERSONAL DETAILS</h2>
          <p>Father's Name: [Father's Name] &nbsp;|&nbsp; Mother's Name: [Mother's Name]<br/>Date of Birth: [DD/MM/YYYY] &nbsp;|&nbsp; NID No: [XXXXXXXXXX] &nbsp;|&nbsp; Nationality: Bangladeshi</p>
          <h2>REFERENCES</h2>
          <p><strong>[Referee Name]</strong>, [Designation], [Organization] — Phone: [01XXXXXXXXX]</p>
          <hr/>
          <p style="text-align: justify;"><em>Declaration:</em> I hereby declare that all information stated above is true and accurate to the best of my knowledge.</p>
          <br/>
          <p style="text-align: right;"><strong>Signature: _______________________</strong><br/>[Your Full Name]</p>
        `,
      },
    ],
  },
  {
    id: 'cv-bn-2page',
    category: 'CV Format',
    lang: 'বাংলা',
    title: '২-পাতার জীবনবৃত্তান্ত / CV (বাংলা)',
    subtitle: 'পৃষ্ঠা ১: পরিচিতি ও অভিজ্ঞতা, পৃষ্ঠা ২: শিক্ষাগত যোগ্যতা ও প্রত্যয়ন',
    pages: [
      {
        id: 'p1',
        html: `
          <h1 style="text-align: center;">জীবনবৃত্তান্ত (CURRICULUM VITAE)</h1>
          <hr/>
          <p><strong>নাম:</strong> [আপনার পূর্ণ নাম]<br/>
          <strong>পিতার নাম:</strong> [পিতার নাম] &nbsp;|&nbsp; <strong>মাতার নাম:</strong> [মাতার নাম]<br/>
          <strong>বর্তমান ঠিকানা:</strong> [বাড়ি/রোড, গ্রাম/মহল্লা, ডাকঘর, উপজেলা, জেলা]<br/>
          <strong>স্থায়ী ঠিকানা:</strong> [স্থায়ী ঠিকানা লিখুন]<br/>
          <strong>মোবাইল:</strong> [০১XXXXXXXXX] &nbsp;|&nbsp; <strong>ইমেইল:</strong> [example@email.com]</p>
          <h2>সংক্ষিপ্ত লক্ষ্য (Career Objective)</h2>
          <p style="text-align: justify;">সততা, নিষ্ঠা ও পেশাদারিত্বের সাথে একটি গতিশীল প্রতিষ্ঠানে কাজ করে নিজের দক্ষতা বৃদ্ধি এবং প্রতিষ্ঠানের উন্নয়নে সক্রিয় ভূমিকা রাখা।</p>
          <h2>কর্মঅভিজ্ঞতা (Work Experience)</h2>
          <p><strong>[পদের নাম]</strong> — [প্রতিষ্ঠানের নাম] <em>([সাল] – [বর্তমান])</em></p>
          <ul>
            <li>দাপ্তরিক নথিপত্র প্রস্তুত, প্রতিবেদন তৈরি ও দৈনন্দিন কার্যক্রম পরিচালনা।</li>
            <li>টিম সমন্বয় ও ক্লায়েন্ট সেবা প্রদানে সক্রিয় ভূমিকা পালন।</li>
          </ul>
          <h2>দক্ষতা ও প্রশিক্ষণ</h2>
          <ul>
            <li><strong>কম্পিউটার দক্ষতা:</strong> বাংলা ও ইংরেজি টাইপিং, এমএস ওয়ার্ড, এক্সেল, পাওয়ারপয়েন্ট</li>
            <li><strong>ভাষাগত দক্ষতা:</strong> বাংলা ও ইংরেজিতে সাবলীল লেখা ও কথোপকথন</li>
          </ul>
        `,
      },
      {
        id: 'p2',
        html: `
          <h2>শিক্ষাগত যোগ্যতা</h2>
          <table>
            <thead>
              <tr>
                <th>পরীক্ষার নাম</th>
                <th>বিভাগ / বিষয়</th>
                <th>বোর্ড / বিশ্ববিদ্যালয়</th>
                <th>পাসের সন</th>
                <th>ফলাফল</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>স্নাতক / সম্মান</td>
                <td>[বিষয়ের নাম]</td>
                <td>[বিশ্ববিদ্যালয়ের নাম]</td>
                <td>[২০২২]</td>
                <td>[সিজিপিএ]</td>
              </tr>
              <tr>
                <td>এইচ.এস.সি</td>
                <td>[বিজ্ঞান / মানবিক / ব্যবসায়]</td>
                <td>[বোর্ডের নাম]</td>
                <td>[২০১৭]</td>
                <td>[জিপিএ]</td>
              </tr>
              <tr>
                <td>এস.এস.সি</td>
                <td>[বিজ্ঞান / মানবিক / ব্যবসায়]</td>
                <td>[বোর্ডের নাম]</td>
                <td>[২০১৫]</td>
                <td>[জিপিএ]</td>
              </tr>
            </tbody>
          </table>
          <h2>ব্যক্তিগত তথ্যাবলি</h2>
          <ul>
            <li><strong>জন্ম তারিখ:</strong> [দিন/মাস/সাল]</li>
            <li><strong>জাতীয় পরিচয়পত্র (NID) নম্বর:</strong> [XXXXXXXXXX]</li>
            <li><strong>জাতীয়তা:</strong> বাংলাদেশি (জন্মসূত্রে) &nbsp;|&nbsp; <strong>ধর্ম:</strong> [ইসলাম / ...]</li>
            <li><strong>বৈবাহিক অবস্থা:</strong> [অবিবাহিত / বিবাহিত]</li>
          </ul>
          <hr/>
          <p style="text-align: justify;"><strong>প্রত্যয়ন:</strong> আমি এই মর্মে প্রত্যয়ন করছি যে, উপরে বর্ণিত সকল তথ্য সম্পূর্ণ সত্য ও নির্ভুল।</p>
          <br/>
          <p style="text-align: right;"><strong>আবেদনকারীর স্বাক্ষর: _____________________</strong><br/>তারিখ: [দিন/মাস/সাল]</p>
        `,
      },
    ],
  },
];

const PAPER_SIZES = {
  A4: { w: 210, h: 297, label: 'A4 (210×297mm)' },
  Letter: { w: 215.9, h: 279.4, label: 'Letter (8.5×11in)' },
  Legal: { w: 215.9, h: 355.6, label: 'Legal (8.5×14in)' },
};

const MARGINS = {
  narrow: { px: '12mm', py: '12mm', label: 'Narrow (12mm)' },
  normal: { px: '20mm', py: '18mm', label: 'Normal (20mm)' },
  wide: { px: '28mm', py: '24mm', label: 'Wide (28mm)' },
};

const DOC_THEMES = [
  { id: 'classic', label: 'Classic Clean', cls: '' },
  { id: 'modern', label: 'Modern Indigo', cls: 'doc-theme-modern' },
  { id: 'executive', label: 'Executive Teal', cls: 'doc-theme-executive' },
  { id: 'formal', label: 'Formal Border', cls: 'doc-theme-formal' },
];

const FONT_FAMILIES = [
  { id: 'sans', label: 'Calibri / Sans', css: "'Inter', 'Segoe UI', 'Noto Sans Bengali', sans-serif" },
  { id: 'serif', label: 'Times / Serif', css: "'Georgia', 'Times New Roman', 'Noto Serif Bengali', serif" },
  { id: 'bengali', label: 'Noto Bengali', css: "'Noto Sans Bengali', 'SolaimanLipi', 'Kalpurush', sans-serif" },
  { id: 'mono', label: 'Consolas / Mono', css: "ui-monospace, SFMono-Regular, Menlo, monospace" },
];

const FONT_SIZES = [10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 36];

function PageSheet({
  page,
  pageIndex,
  totalPages,
  resetNonce,
  isActive,
  paperDimensions,
  marginSpec,
  fontCss,
  fontSizePx,
  lineHeight,
  themeClass,
  showPageNumbers,
  headerText,
  onFocusPage,
  onInputPage,
  onAddPageAfter,
  onDuplicatePage,
  onMovePage,
  onDeletePage,
  registerRef,
}) {
  const localRef = useRef(null);

  useEffect(() => {
    if (localRef.current) {
      localRef.current.innerHTML = page.html;
      registerRef(page.id, localRef.current);
    }
    return () => registerRef(page.id, null);
    // Only re-hydrate DOM when page id mounts or resetNonce increments
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.id, resetNonce]);

  return (
    <div className="flex flex-col items-center">
      {/* Page Header Controls (Non-printable) */}
      <div className="no-print w-full flex items-center justify-between px-2 mb-1.5 text-[11px]">
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full font-bold ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Page {pageIndex + 1} of {totalPages}
          </span>
          {isActive && (
            <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
              Active Editing Sheet
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onAddPageAfter(pageIndex)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            title="Insert blank page below"
          >
            <Plus className="w-3 h-3" />
            <span>Add Page</span>
          </button>

          <button
            type="button"
            onClick={() => onDuplicatePage(pageIndex)}
            className="p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600"
            title="Duplicate this page"
          >
            <Copy className="w-3 h-3" />
          </button>

          {totalPages > 1 && (
            <>
              <button
                type="button"
                disabled={pageIndex === 0}
                onClick={() => onMovePage(pageIndex, -1)}
                className="p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-30"
                title="Move page up"
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                disabled={pageIndex === totalPages - 1}
                onClick={() => onMovePage(pageIndex, 1)}
                className="p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-30"
                title="Move page down"
              >
                <ArrowDown className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => onDeletePage(pageIndex)}
                className="p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                title="Delete this page"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Physical Paper Sheet */}
      <div
        onMouseDown={() => onFocusPage(page.id)}
        style={{
          width: `${paperDimensions.w}mm`,
          minHeight: `${paperDimensions.h}mm`,
          paddingLeft: marginSpec.px,
          paddingRight: marginSpec.px,
          paddingTop: marginSpec.py,
          paddingBottom: marginSpec.py,
          fontFamily: fontCss,
          fontSize: `${fontSizePx}px`,
          lineHeight,
        }}
        className={`print-page-sheet relative flex flex-col justify-between bg-white text-slate-900 shadow-a4 rounded-sm transition-shadow ${themeClass} ${
          isActive
            ? 'ring-2 ring-indigo-500/70'
            : 'border border-slate-200/90'
        }`}
      >
        <div>
          {headerText && (
            <div className="mb-3 pb-1.5 border-b border-slate-200 text-[10px] text-slate-400 flex justify-between">
              <span>{headerText}</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          )}

          <div
            ref={localRef}
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusPage(page.id)}
            onInput={(e) => onInputPage(page.id, e.currentTarget.innerHTML)}
            data-placeholder="Start typing on this page, or use the Ribbon to insert tables, images, headings..."
            className="a4-editor-content min-h-[220mm]"
          />
        </div>

        {showPageNumbers && (
          <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] text-slate-400 text-right">
            Page {pageIndex + 1} of {totalPages}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DocEditor({
  incomingDocument,
  onClearIncomingDocument,
  onSaveToVault,
}) {
  const initialSaved = (() => {
    try {
      const raw = localStorage.getItem(DOC_DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const [docTitle, setDocTitle] = useState(
    initialSaved?.title || TEMPLATES[0].title
  );
  const [pages, setPages] = useState(
    initialSaved?.pages?.length ? initialSaved.pages : TEMPLATES[0].pages
  );
  const [activePageId, setActivePageId] = useState(
    () => (initialSaved?.pages?.[0]?.id) || TEMPLATES[0].pages[0].id
  );
  const [resetNonce, setResetNonce] = useState(0);

  // Word Ribbon & Document Settings
  const [ribbonTab, setRibbonTab] = useState('home'); // 'home' | 'insert' | 'layout'
  const [showTemplates, setShowTemplates] = useState(true);
  const [activeTemplateId, setActiveTemplateId] = useState(
    initialSaved?.templateId || TEMPLATES[0].id
  );
  const [fontFamilyId, setFontFamilyId] = useState(
    initialSaved?.fontFamilyId || 'sans'
  );
  const [fontSizePx, setFontSizePx] = useState(initialSaved?.fontSizePx || 14);
  const [lineHeight, setLineHeight] = useState(initialSaved?.lineHeight || 1.6);
  const [paperSize, setPaperSize] = useState(initialSaved?.paperSize || 'A4');
  const [orientation, setOrientation] = useState(
    initialSaved?.orientation || 'portrait'
  );
  const [marginKey, setMarginKey] = useState(initialSaved?.marginKey || 'normal');
  const [docTheme, setDocTheme] = useState(initialSaved?.docTheme || 'classic');
  const [showPageNumbers, setShowPageNumbers] = useState(
    initialSaved?.showPageNumbers ?? true
  );
  const [headerText, setHeaderText] = useState(initialSaved?.headerText || '');

  const [textColor, setTextColor] = useState('#0f172a');
  const [highlightColor, setHighlightColor] = useState('#fef08a');
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  const [langFilter, setLangFilter] = useState('All');
  const [sheetZoom, setSheetZoom] = useState(0.85);
  const [stats, setStats] = useState({ words: 0, chars: 0 });
  const [previousSnapshot, setPreviousSnapshot] = useState(null);
  const [vaultSavedNotice, setVaultSavedNotice] = useState(false);

  const pageRefs = useRef({});
  const imageInsertInputRef = useRef(null);

  const registerRef = useCallback((id, el) => {
    if (el) pageRefs.current[id] = el;
    else delete pageRefs.current[id];
  }, []);

  const computeStats = useCallback((nextPages) => {
    const tmp = document.createElement('div');
    let fullText = '';
    nextPages.forEach((p) => {
      tmp.innerHTML = p.html || '';
      fullText += ` ${tmp.innerText || tmp.textContent || ''}`;
    });
    const clean = fullText.trim();
    const words = clean ? clean.split(/\s+/).filter(Boolean).length : 0;
    setStats({ words, chars: clean.length });
  }, []);

  useEffect(() => {
    computeStats(pages);
    try {
      localStorage.setItem(
        DOC_DRAFT_KEY,
        JSON.stringify({
          title: docTitle,
          templateId: activeTemplateId,
          fontFamilyId,
          fontSizePx,
          lineHeight,
          paperSize,
          orientation,
          marginKey,
          docTheme,
          showPageNumbers,
          headerText,
          pages,
          updatedAt: Date.now(),
        })
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [
    docTitle,
    activeTemplateId,
    fontFamilyId,
    fontSizePx,
    lineHeight,
    paperSize,
    orientation,
    marginKey,
    docTheme,
    showPageNumbers,
    headerText,
    pages,
    computeStats,
  ]);

  // Dynamic @page size & orientation print rule
  useEffect(() => {
    const styleId = 'utilitydesk-dynamic-page-style';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `@media print { @page { size: ${paperSize} ${orientation}; margin: 0; } }`;
  }, [paperSize, orientation]);

  // Receive document sent from Vault
  useEffect(() => {
    if (!incomingDocument) return;
    setPreviousSnapshot({ title: docTitle, pages, templateId: activeTemplateId });
    const rawContent = incomingDocument.content || '';
    const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(rawContent);
    const html = looksLikeHtml
      ? rawContent
      : rawContent
          .split(/\n{2,}/)
          .map(
            (para) =>
              `<p>${para
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '<br/>')}</p>`
          )
          .join('');
    const nextPages = [{ id: `p-${Date.now()}`, html: html || '<p><br/></p>' }];
    setDocTitle(incomingDocument.title || 'Vault Document');
    setPages(nextPages);
    setActivePageId(nextPages[0].id);
    setActiveTemplateId('custom');
    setResetNonce((n) => n + 1);
    if (onClearIncomingDocument) onClearIncomingDocument();
  }, [incomingDocument, docTitle, pages, activeTemplateId, onClearIncomingDocument]);

  const getActiveEditorEl = () =>
    pageRefs.current[activePageId] || Object.values(pageRefs.current)[0] || null;

  const syncActivePageDomToState = () => {
    const el = getActiveEditorEl();
    if (!el) return;
    const html = el.innerHTML;
    setPages((prev) =>
      prev.map((p) => (p.id === activePageId ? { ...p, html } : p))
    );
  };

  const execFormat = (command, value = null) => {
    const el = getActiveEditorEl();
    if (!el) return;
    el.focus();
    document.execCommand(command, false, value);
    syncActivePageDomToState();
  };

  const applyFontSize = (px) => {
    setFontSizePx(px);
    const el = getActiveEditorEl();
    if (!el) return;
    el.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      if (selection && selection.anchorNode) {
        let node =
          selection.anchorNode.nodeType === 3
            ? selection.anchorNode.parentElement
            : selection.anchorNode;
        while (node && node !== el && getComputedStyle(node).display === 'inline') {
          node = node.parentElement;
        }
        if (node && el.contains(node) && node !== el) {
          node.style.fontSize = `${px}px`;
        }
      }
      syncActivePageDomToState();
      return;
    }

    document.execCommand('fontSize', false, '7');
    el.querySelectorAll('font[size="7"]').forEach((fontEl) => {
      const span = document.createElement('span');
      span.style.fontSize = `${px}px`;
      while (fontEl.firstChild) span.appendChild(fontEl.firstChild);
      fontEl.parentNode.replaceChild(span, fontEl);
    });
    syncActivePageDomToState();
  };

  const insertHtmlAtCursor = (htmlSnippet) => {
    const el = getActiveEditorEl();
    if (!el) return;
    el.focus();
    document.execCommand('insertHTML', false, htmlSnippet);
    syncActivePageDomToState();
  };

  const handleInsertTable = () => {
    const rCount = Math.max(1, Math.min(12, Number(tableRows) || 3));
    const cCount = Math.max(1, Math.min(8, Number(tableCols) || 3));
    const headerCells = Array.from({ length: cCount }, (_, i) => `<th>Header ${i + 1}</th>`).join('');
    const bodyRows = Array.from({ length: Math.max(1, rCount - 1) }, () => {
      const cells = Array.from({ length: cCount }, () => '<td>Cell</td>').join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    insertHtmlAtCursor(
      `<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table><p><br/></p>`
    );
  };

  const handleInsertImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      insertHtmlAtCursor(
        `<p><img src="${ev.target.result}" alt="Inserted" style="max-width: 180px; height: auto;" /></p>`
      );
    };
    reader.readAsDataURL(file);
  };

  // Multi-Page Actions
  const handleAddPageAfter = (index) => {
    const newPage = {
      id: `page-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      html: `<p>Page ${index + 2} content...</p>`,
    };
    setPages((prev) => {
      const copy = [...prev];
      copy.splice(index + 1, 0, newPage);
      return copy;
    });
    setActivePageId(newPage.id);
    setResetNonce((n) => n + 1);
  };

  const handleDuplicatePage = (index) => {
    const source = pages[index];
    if (!source) return;
    const dup = {
      id: `page-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      html: source.html,
    };
    setPages((prev) => {
      const copy = [...prev];
      copy.splice(index + 1, 0, dup);
      return copy;
    });
    setActivePageId(dup.id);
    setResetNonce((n) => n + 1);
  };

  const handleMovePage = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= pages.length) return;
    setPages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(target, 0, item);
      return copy;
    });
    setResetNonce((n) => n + 1);
  };

  const handleDeletePage = (index) => {
    if (pages.length <= 1) return;
    const deletedId = pages[index].id;
    const remaining = pages.filter((_, i) => i !== index);
    setPages(remaining);
    if (activePageId === deletedId) {
      setActivePageId(remaining[Math.max(0, index - 1)].id);
    }
    setResetNonce((n) => n + 1);
  };

  const loadTemplate = (tpl) => {
    setPreviousSnapshot({ title: docTitle, pages, templateId: activeTemplateId });
    const clonedPages = tpl.pages.map((p, idx) => ({
      id: `tpl-${tpl.id}-${idx}-${Date.now()}`,
      html: p.html.trim(),
    }));
    setPages(clonedPages);
    setActivePageId(clonedPages[0].id);
    setDocTitle(tpl.title);
    setActiveTemplateId(tpl.id);
    if (tpl.lang === 'বাংলা') setFontFamilyId('bengali');
    setResetNonce((n) => n + 1);
  };

  const handleRestorePrevious = () => {
    if (!previousSnapshot) return;
    setPages(previousSnapshot.pages);
    setActivePageId(previousSnapshot.pages[0]?.id);
    setDocTitle(previousSnapshot.title);
    setActiveTemplateId(previousSnapshot.templateId);
    setPreviousSnapshot(null);
    setResetNonce((n) => n + 1);
  };

  const handleBlankDocument = () => {
    setPreviousSnapshot({ title: docTitle, pages, templateId: activeTemplateId });
    const fresh = [{ id: `page-${Date.now()}`, html: '<p>Start writing here...</p>' }];
    setPages(fresh);
    setActivePageId(fresh[0].id);
    setDocTitle('Untitled Document');
    setActiveTemplateId('blank');
    setResetNonce((n) => n + 1);
  };

  const handleSaveCurrentToVault = () => {
    if (!onSaveToVault) return;
    const tmp = document.createElement('div');
    const combined = pages
      .map((p, idx) => {
        tmp.innerHTML = p.html || '';
        const text = (tmp.innerText || '').trim();
        return pages.length > 1 ? `--- Page ${idx + 1} ---\n${text}` : text;
      })
      .join('\n\n');
    if (!combined.trim()) return;
    onSaveToVault({
      title: docTitle.trim() || 'Saved Document',
      category: 'Template',
      content: combined,
    });
    setVaultSavedNotice(true);
    setTimeout(() => setVaultSavedNotice(false), 2200);
  };

  const handleExportWordDoc = () => {
    const themeCss =
      docTheme === 'modern'
        ? 'h1,h2{color:#3730a3;}h2{border-bottom:1px solid #c7d2fe;}'
        : docTheme === 'executive'
        ? 'h2{color:#0f766e;border-bottom:1px solid #99f6e4;}'
        : '';
    const bodyPages = pages
      .map(
        (p, idx) =>
          `<div style="${idx < pages.length - 1 ? 'page-break-after:always;' : ''}">${p.html}</div>`
      )
      .join('');
    const wordHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${docTitle}</title><style>body{font-family:Calibri,Arial,'Noto Sans Bengali',sans-serif;font-size:${fontSizePx}px;line-height:${lineHeight};}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #94a3b8;padding:6px;}${themeCss}</style></head><body>${bodyPages}</body></html>`;
    const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(docTitle || 'document').replace(/[^a-z0-9\u0980-\u09FF_-]+/gi, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const basePaper = PAPER_SIZES[paperSize] || PAPER_SIZES.A4;
  const paperDimensions =
    orientation === 'landscape'
      ? { w: basePaper.h, h: basePaper.w }
      : { w: basePaper.w, h: basePaper.h };
  const marginSpec = MARGINS[marginKey] || MARGINS.normal;
  const selectedFontCss =
    FONT_FAMILIES.find((f) => f.id === fontFamilyId)?.css || FONT_FAMILIES[0].css;
  const themeClass = DOC_THEMES.find((t) => t.id === docTheme)?.cls || '';

  const visibleTemplates = TEMPLATES.filter(
    (t) => langFilter === 'All' || t.lang === langFilter
  );

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-200/75 dark:bg-slate-950 print-reset-layout">
      <input
        ref={imageInsertInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          handleInsertImageFile(e.target.files?.[0]);
          e.target.value = '';
        }}
        className="hidden"
      />

      {/* MS Word Style Top Header & Ribbon (Hidden when printing) */}
      <div className="no-print bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm z-10">
        {/* Title & Action Bar */}
        <div className="px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/15 to-blue-500/15 text-indigo-600 dark:text-indigo-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full max-w-sm px-2.5 py-1 rounded-lg text-sm font-extrabold bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-50 dark:focus:bg-slate-800 text-slate-900 dark:text-white border border-transparent focus:border-indigo-500 focus:outline-none"
              placeholder="Document Title..."
            />

            {/* Ribbon Tabs */}
            <div className="hidden md:flex items-center gap-1 ml-3 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
              {[
                { id: 'home', label: 'Home' },
                { id: 'insert', label: 'Insert' },
                { id: 'layout', label: 'Page & Style' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setRibbonTab(t.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    ribbonTab === t.id
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Global Actions */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleAddPageAfter(pages.length - 1)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Page</span>
            </button>

            <button
              type="button"
              onClick={handleBlankDocument}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Blank</span>
            </button>

            <button
              type="button"
              onClick={handleExportWordDoc}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-200/70 dark:border-sky-500/30"
              title="Download Microsoft Word compatible .doc file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.DOC</span>
            </button>

            {onSaveToVault && (
              <button
                type="button"
                onClick={handleSaveCurrentToVault}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-500/30"
              >
                {vaultSavedNotice ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Vault</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print ({pages.length}p)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowTemplates((v) => !v)}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              title={showTemplates ? 'Hide Templates' : 'Show Templates'}
            >
              {showTemplates ? (
                <PanelRightClose className="w-4 h-4" />
              ) : (
                <PanelRightOpen className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Ribbon Tabs */}
        <div className="flex md:hidden items-center gap-1 px-4 pt-2">
          {[
            { id: 'home', label: 'Home' },
            { id: 'insert', label: 'Insert' },
            { id: 'layout', label: 'Page & Style' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setRibbonTab(t.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                ribbonTab === t.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Ribbon Content Row */}
        <div className="px-5 py-2 flex flex-wrap items-center gap-1.5 min-h-[46px]">
          {ribbonTab === 'home' && (
            <>
              <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200 dark:border-slate-700">
                <button type="button" onClick={() => execFormat('undo')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Undo">
                  <Undo2 className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => execFormat('redo')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Redo">
                  <Redo2 className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => execFormat('removeFormat')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Clear formatting">
                  <Eraser className="w-4 h-4" />
                </button>
              </div>

              {/* Block Style + Font + Size */}
              <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200 dark:border-slate-700">
                <select
                  onChange={(e) => {
                    execFormat('formatBlock', e.target.value);
                    e.target.value = 'P';
                  }}
                  defaultValue="P"
                  className="px-2 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  title="Text Style"
                >
                  <option value="P">Normal Text</option>
                  <option value="H1">Heading 1</option>
                  <option value="H2">Heading 2</option>
                  <option value="H3">Heading 3</option>
                  <option value="BLOCKQUOTE">Quote Box</option>
                </select>

                <select
                  value={fontFamilyId}
                  onChange={(e) => setFontFamilyId(e.target.value)}
                  className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  aria-label="Font family"
                >
                  {FONT_FAMILIES.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => applyFontSize(Math.max(10, fontSizePx - 1))}
                    className="px-1.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800"
                    title="Decrease font size"
                  >
                    A-
                  </button>
                  <select
                    value={fontSizePx}
                    onChange={(e) => applyFontSize(Number(e.target.value))}
                    className="px-1.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    {FONT_SIZES.map((sz) => (
                      <option key={sz} value={sz}>
                        {sz}px
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => applyFontSize(Math.min(48, fontSizePx + 1))}
                    className="px-1.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800"
                    title="Increase font size"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* Text Formatting */}
              <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200 dark:border-slate-700">
                <button type="button" onClick={() => execFormat('bold')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Bold">
                  <Bold className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => execFormat('italic')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Italic">
                  <Italic className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => execFormat('underline')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Underline">
                  <Underline className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => execFormat('strikeThrough')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Strikethrough">
                  <Strikethrough className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => execFormat('superscript')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Superscript">
                  <Superscript className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => execFormat('subscript')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Subscript">
                  <Subscript className="w-4 h-4" />
                </button>
              </div>

              {/* Text & Highlight Colors */}
              <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200 dark:border-slate-700">
                <label className="inline-flex items-center gap-1 px-1.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 cursor-pointer" title="Text Color">
                  <Palette className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => {
                      setTextColor(e.target.value);
                      execFormat('foreColor', e.target.value);
                    }}
                    className="w-4 h-4 border-0 bg-transparent cursor-pointer"
                  />
                </label>

                <label className="inline-flex items-center gap-1 px-1.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 cursor-pointer" title="Highlight Color">
                  <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                  <input
                    type="color"
                    value={highlightColor}
                    onChange={(e) => {
                      setHighlightColor(e.target.value);
                      execFormat('hiliteColor', e.target.value);
                    }}
                    className="w-4 h-4 border-0 bg-transparent cursor-pointer"
                  />
                </label>
              </div>

              {/* Alignment & Lists & Indent */}
              <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200 dark:border-slate-700">
                <button type="button" onClick={() => execFormat('justifyLeft')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Align Left">
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => execFormat('justifyCenter')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Center">
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => execFormat('justifyRight')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Align Right">
                  <AlignRight className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => execFormat('justifyFull')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Justify">
                  <AlignJustify className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => execFormat('insertUnorderedList')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Bullet List">
                  <List className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => execFormat('insertOrderedList')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Numbered List">
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => execFormat('outdent')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Decrease Indent">
                  <Outdent className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => execFormat('indent')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Increase Indent">
                  <Indent className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {ribbonTab === 'insert' && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Table Creator */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                <Table className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={tableRows}
                  onChange={(e) => setTableRows(e.target.value)}
                  className="w-10 px-1 py-0.5 rounded bg-white dark:bg-slate-900 text-xs font-mono text-center"
                  title="Rows"
                />
                <span className="text-xs text-slate-400">×</span>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={tableCols}
                  onChange={(e) => setTableCols(e.target.value)}
                  className="w-10 px-1 py-0.5 rounded bg-white dark:bg-slate-900 text-xs font-mono text-center"
                  title="Columns"
                />
                <button
                  type="button"
                  onClick={handleInsertTable}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Insert Table
                </button>
              </div>

              <button
                type="button"
                onClick={() => imageInsertInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Insert Photo / Sign</span>
              </button>

              <button
                type="button"
                onClick={() => insertHtmlAtCursor('<hr/><p><br/></p>')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Divider Line</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  insertHtmlAtCursor(
                    `<span>${new Date().toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}</span>`
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800"
              >
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                <span>Date Stamp</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  insertHtmlAtCursor(
                    '<br/><p style="text-align:right;"><strong>______________________</strong><br/>Signature &amp; Date</p>'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800"
              >
                <PenLine className="w-3.5 h-3.5 text-violet-600" />
                <span>Signature Block</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  insertHtmlAtCursor(
                    '<blockquote><strong>Note:</strong> Write highlighted summary or notice here...</blockquote><p><br/></p>'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800"
              >
                <span>Callout Box</span>
              </button>
            </div>
          )}

          {ribbonTab === 'layout' && (
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <select
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                title="Paper Size"
              >
                {Object.entries(PAPER_SIZES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>

              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>

              <select
                value={marginKey}
                onChange={(e) => setMarginKey(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                {Object.entries(MARGINS).map(([k, v]) => (
                  <option key={k} value={k}>
                    Margin: {v.label}
                  </option>
                ))}
              </select>

              <select
                value={lineHeight}
                onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                className="px-2.5 py-1.5 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                {[1.15, 1.35, 1.5, 1.6, 1.8, 2.0].map((lh) => (
                  <option key={lh} value={lh}>
                    Line Space: {lh}
                  </option>
                ))}
              </select>

              <select
                value={docTheme}
                onChange={(e) => setDocTheme(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl font-semibold bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30"
              >
                {DOC_THEMES.map((t) => (
                  <option key={t.id} value={t.id}>
                    Style: {t.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                placeholder="Optional Running Header..."
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-44"
              />

              <label className="inline-flex items-center gap-1.5 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPageNumbers}
                  onChange={(e) => setShowPageNumbers(e.target.checked)}
                  className="rounded accent-indigo-600"
                />
                <span>Page Numbers</span>
              </label>
            </div>
          )}

          {/* Right Zoom & Telemetry */}
          <div className="flex items-center gap-2 ml-auto text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-1.5 py-0.5">
              <button
                type="button"
                onClick={() => setSheetZoom((z) => Math.max(0.55, Number((z - 0.1).toFixed(2))))}
                className="p-1 hover:text-slate-900 dark:hover:text-white"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] w-10 text-center">
                {Math.round(sheetZoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setSheetZoom((z) => Math.min(1.25, Number((z + 0.1).toFixed(2))))}
                className="p-1 hover:text-slate-900 dark:hover:text-white"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="hidden xl:inline font-mono text-[11px]">
              {pages.length} page{pages.length > 1 ? 's' : ''} • {stats.words} words
            </span>
          </div>
        </div>
      </div>

      {/* Main Content: Multi-Page Paper Desk + Templates Side Panel */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row print-reset-layout">
        {/* Scrollable Multi-Page Desk */}
        <div className="flex-1 overflow-auto p-6 md:p-8 flex flex-col items-center print-reset-layout">
          {previousSnapshot && (
            <div className="no-print mb-4 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center gap-3 text-xs text-indigo-800 dark:text-indigo-200">
              <span>Document replaced. Need your previous pages back?</span>
              <button
                type="button"
                onClick={handleRestorePrevious}
                className="inline-flex items-center gap-1 font-bold underline hover:no-underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Previous</span>
              </button>
            </div>
          )}

          {/* Stacked Multi-Page Container */}
          <div
            className="print-reset-layout origin-top space-y-8 transition-transform duration-150"
            style={{ transform: `scale(${sheetZoom})` }}
          >
            {pages.map((page, index) => (
              <PageSheet
                key={page.id}
                page={page}
                pageIndex={index}
                totalPages={pages.length}
                resetNonce={resetNonce}
                isActive={activePageId === page.id}
                paperDimensions={paperDimensions}
                marginSpec={marginSpec}
                fontCss={selectedFontCss}
                fontSizePx={fontSizePx}
                lineHeight={lineHeight}
                themeClass={themeClass}
                showPageNumbers={showPageNumbers}
                headerText={headerText}
                onFocusPage={setActivePageId}
                onInputPage={(pid, html) =>
                  setPages((prev) =>
                    prev.map((item) => (item.id === pid ? { ...item, html } : item))
                  )
                }
                onAddPageAfter={handleAddPageAfter}
                onDuplicatePage={handleDuplicatePage}
                onMovePage={handleMovePage}
                onDeletePage={handleDeletePage}
                registerRef={registerRef}
              />
            ))}

            <div className="no-print flex justify-center pb-10">
              <button
                type="button"
                onClick={() => handleAddPageAfter(pages.length - 1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Page {pages.length + 1}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Right Templates Side Panel */}
        {showTemplates && (
          <aside className="no-print w-full lg:w-76 xl:w-80 shrink-0 bg-white/95 dark:bg-slate-900/95 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Document Templates
                  </h3>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
                  EN &amp; বাংলা
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 mt-3 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                {['All', 'English', 'বাংলা'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLangFilter(lang)}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      langFilter === lang
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
              {visibleTemplates.map((tpl) => {
                const active = activeTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => loadTemplate(tpl)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                      active
                        ? 'bg-indigo-50 dark:bg-indigo-500/15 border-indigo-400 dark:border-indigo-500/60 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {tpl.category} • {tpl.pages.length}p
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          tpl.lang === 'বাংলা'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                            : 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300'
                        }`}
                      >
                        {tpl.lang}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {tpl.title}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {tpl.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
