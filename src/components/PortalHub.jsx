import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Globe,
  Landmark,
  CreditCard,
  BookOpen,
  Briefcase,
  GraduationCap,
  ExternalLink,
  Star,
  Plus,
  X,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  ArrowUpRight,
  Maximize2,
  Share2,
  Copy,
  Info,
  MapPin,
  HelpCircle,
  AlertCircle,
  Building2,
  Flame,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Govt Services',
  'NID & Voter',
  'Passport & Travel',
  'Jobs & Career',
  'Land & Property',
  'Education',
  'Banking & Utility',
];

const OFFICIAL_SERVICES = [
  {
    id: 'nid-services',
    title: 'NID অনলাইন সেবা (Smart NID)',
    titleEn: 'NID Wing Online Services',
    category: 'NID & Voter',
    url: 'https://services.nidw.gov.bd/nid-pub/',
    dept: 'বাংলাদেশ নির্বাচন কমিশন (ECS)',
    description: 'নতুন ভোটার নিবন্ধন, এনআইডি অনলাইন কপি ডাউনলোড, তথ্য সংশোধন ও রি-ইস্যু আবেদন।',
    documents: ['পূর্বের ভোটার স্লিপ নম্বর / এনআইডি নম্বর', 'জন্ম নিবন্ধন সনদ কপি', 'মোবাইল নম্বর (OTP ও ফেস ভেরিফিকেশনের জন্য)'],
    fee: 'সাধারণ সংশোধন ২৩০-৩৪৫ টাকা (রকেট/বিকাশ)',
    photoSpec: 'সরাসরি ওয়েবক্যাম/মোবাইল ফেস স্ক্যান',
    tags: ['nid', 'voter', 'smart card', 'এনআইডি', 'ভোটার', 'সংশোধন', 'ecs'],
    badge: 'সবচেয়ে জনপ্রিয়',
    featured: true,
  },
  {
    id: 'epassport-portal',
    title: 'ই-পাসপোর্ট অনলাইন আবেদন',
    titleEn: 'e-Passport Bangladesh Portal',
    category: 'Passport & Travel',
    url: 'https://www.epassport.gov.bd/',
    dept: 'ইমিগ্রেশন ও পাসপোর্ট অধিদপ্তর (DIP)',
    description: 'নতুন ই-পাসপোর্ট বা নবায়নের অনলাইন ফর্ম পূরণ, বায়োমেট্রিক অ্যাপয়েন্টমেন্ট শিডিউলিং।',
    documents: ['স্মার্ট এনআইডি বা অনলাইন জন্ম নিবন্ধন', 'পুরাতন পাসপোর্ট (যদি থাকে)', 'এ-চালান ব্যাংক জমার স্লিপ'],
    fee: '৪৮ পাতা ৫ বছর: ৪,০২৫ টাকা | ১০ বছর: ৫,৭৫০ টাকা',
    photoSpec: 'পাসপোর্ট সাইজ ছবি (৩০০ × ৩০০ px, ১০০ KB)',
    photoStudioPreset: 'passport',
    tags: ['passport', 'epassport', 'পাসপোর্ট', 'ই-পাসপোর্ট', 'ভিসা', 'travel'],
    badge: 'অফিশিয়াল',
    featured: true,
  },
  {
    id: 'epassport-status',
    title: 'ই-পাসপোর্ট স্ট্যাটাস চেক',
    titleEn: 'e-Passport Application Status',
    category: 'Passport & Travel',
    url: 'https://www.epassport.gov.bd/authorization/application-status',
    dept: 'ইমিগ্রেশন ও পাসপোর্ট অধিদপ্তর',
    description: 'আবেদন নম্বর বা ওআইডি দিয়ে পাসপোর্ট প্রিন্টিং ও ডেলিভারি স্ট্যাটাস ট্র্যাকিং।',
    documents: ['Application ID (OID) অথবা Online Registration ID', 'আবেদনকারীর জন্মতারিখ'],
    fee: 'ফ্রি অনলাইন ট্র্যাকিং',
    photoSpec: 'প্রয়োজন নেই',
    tags: ['passport status', 'track passport', 'পাসপোর্ট চেক', 'ডেলিভারি'],
    featured: false,
  },
  {
    id: 'police-clearance',
    title: 'অনলাইন পুলিশ ক্লিয়ারেন্স (PCC)',
    titleEn: 'Online Police Clearance Certificate',
    category: 'Govt Services',
    url: 'https://pcc.police.gov.bd/main/',
    dept: 'বাংলাদেশ পুলিশ হেডকোয়ার্টার্স',
    description: 'বিদেশে ভ্রমণ, চাকরি ও অভিবাসনের জন্য ডিজিটাল পুলিশ ক্লিয়ারেন্স সার্টিফিকেট আবেদন।',
    documents: ['পাসপোর্টের সত্যায়িত কপি', 'ইউপি চেয়ারম্যান / কাউন্সিলর প্রত্যয়ন', '৫০০ টাকার ই-চালান স্লিপ (কোড: 1-2211-0000-2041)'],
    fee: 'সরকারি ফি ৫০০ টাকা (এ-চালান)',
    photoSpec: 'পাসপোর্ট সাইজ ছবি (৩০০ × ৩০০ px, সাদা ব্যাকগ্রাউন্ড)',
    photoStudioPreset: 'passport',
    tags: ['police', 'clearance', 'pcc', 'পুলিশ', 'ক্লিয়ারেন্স', 'সার্টিফিকেট'],
    badge: 'জরুরি সেবা',
    featured: true,
  },
  {
    id: 'land-portal',
    title: 'স্মার্ট ভূমি সেবা (খতিয়ান ও নামজারি)',
    titleEn: 'Smart Land Services (Khatian & Mutation)',
    category: 'Land & Property',
    url: 'https://land.gov.bd/',
    dept: 'ভূমি মন্ত্রণালয়, বাংলাদেশ',
    description: 'অনলাইনে খতিয়ান (পর্চা) অনুসন্ধান, ডাউনলোড এবং ভূমি উন্নয়ন কর (খাজনা) প্রদান।',
    documents: ['বিগত দাখিলার কপি', 'খতিয়ান বা দাগ নম্বর', 'মালিকের এনআইডি নম্বর ও মোবাইল'],
    fee: 'খতিয়ান সার্টিফাইড কপি ১০০ টাকা (ডাকযোগে ঘরে ডেলিভারি)',
    photoSpec: 'পাসপোর্ট সাইজ ছবি (৩০০ × ৩০০ px)',
    photoStudioPreset: 'passport',
    tags: ['land', 'khatian', 'porcha', 'খতিয়ান', 'পর্চা', 'নামজারি', 'ভূমি', 'খাজনা'],
    featured: true,
  },
  {
    id: 'land-mutation',
    title: 'ই-নামজারি অনলাইন আবেদন',
    titleEn: 'e-Namjari / Land Mutation Portal',
    category: 'Land & Property',
    url: 'https://mutation.land.gov.bd/',
    dept: 'ভূমি মন্ত্রণালয়',
    description: 'জমি খারিজ ও নামজারির জন্য অনলাইন আবেদন ও শুনানির অগ্রগতি ট্র্যাকিং।',
    documents: ['মূল দলিল বা বায়া দলিল', 'পূর্বের খতিয়ান', 'ওয়ারিশান সনদ (প্রযোজ্য ক্ষেত্রে)'],
    fee: 'কোর্ট ফি ২০ টাকা + নোটিশ ফি ৫০ টাকা (মোট ১,১৭০ টাকা অনুমোদন সাপেক্ষে)',
    photoSpec: 'আবেদনকারীর ছবি ও স্বাক্ষর (৩০০ × ৮০ px)',
    photoStudioPreset: 'signature',
    tags: ['mutation', 'namjari', 'খারিজ', 'নামজারি', 'দলিল'],
    featured: false,
  },
  {
    id: 'bdris-birth',
    title: 'জন্ম ও মৃত্যু নিবন্ধন (BDRIS)',
    titleEn: 'Birth & Death Registration System',
    category: 'Govt Services',
    url: 'https://bdris.gov.bd/br/application',
    dept: 'রেজিস্ট্রার জেনারেলের কার্যালয়, জন্ম ও মৃত্যু নিবন্ধন',
    description: 'নতুন জন্ম নিবন্ধনের অনলাইন আবেদন, আবেদনপত্র প্রিন্ট এবং তথ্য যাচাই।',
    documents: ['ইপিআই টিকা কার্ড বা হাসপাতালের প্রত্যয়ন', 'পিতামাতার অনলাইন জন্ম সনদ ও এনআইডি', 'বাসার হোল্ডিং ট্যাক্স রসিদ'],
    fee: '০-৪৫ দিন পর্যন্ত ফ্রি, ৫ বছর পর্যন্ত ৫০ টাকা, তদূর্ধ্ব ১০০ টাকা',
    photoSpec: 'শিশুর সাম্প্রতিক রঙিন ছবি',
    tags: ['birth', 'death', 'bdris', 'জন্ম নিবন্ধন', 'জন্ম সনদ', 'মৃত্যু'],
    badge: 'নাগরিক সেবা',
    featured: true,
  },
  {
    id: 'brta-bsp',
    title: 'বিআরটিএ সেবা পোর্টাল (BSP)',
    titleEn: 'BRTA Service Portal (Driving License)',
    category: 'Govt Services',
    url: 'https://bsp.brta.gov.bd/',
    dept: 'বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ (BRTA)',
    description: 'শিক্ষানবিশ ড্রাইভিং লাইসেন্স (লার্নার), স্মার্ট কার্ড লাইসেন্স ও গাড়ির ট্যাক্স টোকেন।',
    documents: ['মেডিকেল সার্টিফিকেট (ফরম খ)', 'শিক্ষাগত যোগ্যতার সনদ (ন্যূনতম ৮ম শ্রেণি)', 'এনআইডি ও ইউটিলিটি বিল কপি'],
    fee: 'লার্নার ফি ৩৪৫-৫১৮ টাকা | পেশাদার ২,৩০০ টাকা | অপেশাদার ৩,৯৯৯ টাকা',
    photoSpec: 'পাসপোর্ট সাইজ ছবি ও স্ক্যান করা স্বাক্ষর',
    photoStudioPreset: 'passport',
    tags: ['brta', 'driving', 'license', 'ড্রাইভিং', 'লাইসেন্স', 'লার্নার', 'গাড়ি'],
    featured: true,
  },
  {
    id: 'nbr-etax',
    title: 'ই-রিটার্ন ও অনলাইন ট্যাক্স (NBR)',
    titleEn: 'NBR Online Income Tax Return & e-TIN',
    category: 'Govt Services',
    url: 'https://etaxnbr.gov.bd/',
    dept: 'জাতীয় রাজস্ব বোর্ড (NBR)',
    description: 'অনলাইনে আয়কর রিটার্ন দাখিল, ট্যাক্স সার্টিফিকেট ডাউনলোড এবং ই-টিআইএন নিবন্ধন।',
    documents: ['১২ ডিজিটের ই-টিআইএন নম্বর', 'এনআইডি দিয়ে বায়োমেট্রিক নিবন্ধিত সিম নম্বর', 'বেতন ও ব্যাংক স্টেটমেন্ট'],
    fee: 'অনলাইন রিটার্ন সাবমিশন সম্পূর্ণ ফ্রি',
    photoSpec: 'প্রয়োজন নেই',
    tags: ['tin', 'tax', 'nbr', 'আয়কর', 'ট্যাক্স', 'রিটার্ন', 'ই-ট্যাক্স'],
    badge: 'ডিজিটাল ট্যাক্স',
    featured: false,
  },
  {
    id: 'alljobs-teletalk',
    title: 'অল জবস টেলিটক (সরকারি চাকরি)',
    titleEn: 'All Jobs Teletalk Recruitment Hub',
    category: 'Jobs & Career',
    url: 'https://alljobs.teletalk.com.bd/',
    dept: 'টেলিটক বাংলাদেশ লিমিটেড',
    description: 'সরকারি সকল মন্ত্রণালয় ও অধিদপ্তরের চাকরির অনলাইন আবেদন ও প্রবেশপত্র ডাউনলোড।',
    documents: ['সকল শিক্ষাগত যোগ্যতার রোল, সন ও জিপিএ', 'পাসপোর্ট সাইজ ফটো (৩০০ × ৩০০ px)', 'স্বাক্ষর (৩০০ × ৮০ px)'],
    fee: 'বিজ্ঞপ্তি অনুযায়ী ১১২ থেকে ৬৬৯ টাকা (টেলিটক সিমের মাধ্যমে)',
    photoSpec: 'ছবি: ৩০০ × ৩০০ px (১০০ KB) | স্বাক্ষর: ৩০০ × ৮০ px (৬০ KB)',
    photoStudioPreset: 'passport',
    tags: ['jobs', 'teletalk', 'govt jobs', 'চাকরি', 'সরকারি চাকরি', 'প্রবেশপত্র', 'admit card'],
    badge: 'চাকরির পোর্টাল',
    featured: true,
  },
  {
    id: 'bdjobs-portal',
    title: 'বিডিজবস ডটকম (বেসরকারি চাকরি)',
    titleEn: 'Bdjobs Career Platform',
    category: 'Jobs & Career',
    url: 'https://www.bdjobs.com/',
    dept: 'Bdjobs.com Limited',
    description: 'ব্যাংক, এনজিও, মাল্টিন্যাশনাল ও আইটি সেক্টরের শীর্ষস্থানীয় চাকরির সার্কুলার।',
    documents: ['আপডেটেড সিভি বা রেজুমে', 'পাসপোর্ট সাইজ ছবি', 'কভার লেটার'],
    fee: 'সাধারণ আবেদন ফ্রি',
    photoSpec: 'পাসপোর্ট সাইজ ছবি (৩০০ × ৩০০ px, সর্বোচ্চ ৫০০ KB)',
    photoStudioPreset: 'passport',
    tags: ['bdjobs', 'private jobs', 'career', 'চাকরি', 'বেসরকারি চাকরি', 'সিভি', 'cv'],
    badge: 'জনপ্রিয় জব পোর্টাল',
    featured: true,
  },
  {
    id: 'bpsc-portal',
    title: 'বিপিএসসি (বিসিএস ও নন-ক্যাডার)',
    titleEn: 'Bangladesh Public Service Commission',
    category: 'Jobs & Career',
    url: 'https://bpsc.gov.bd/',
    dept: 'বাংলাদেশ সরকারি কর্ম কমিশন (BPSC)',
    description: 'বিসিএস প্রিলিমিনারি, লিখিত পরীক্ষার সার্কুলার, প্রবেশপত্র ও ফলাফল প্রকাশনা।',
    documents: ['বিপিএসসি অনলাইন ফর্ম BPSC-1', 'স্নাতক ও স্নাতকোত্তর সনদ', '৩০০ × ৩০০ ছবি ও ৩০০ × ৮০ স্বাক্ষর'],
    fee: 'সাধারণ ৭০০ টাকা, অনগ্রসর ১০০ টাকা',
    photoSpec: 'ছবি: ৩০০ × ৩০০ px | স্বাক্ষর: ৩০০ × ৮০ px',
    photoStudioPreset: 'signature',
    tags: ['bcs', 'bpsc', 'বিসিএস', 'ক্যাডার', 'কর্ম কমিশন'],
    featured: false,
  },
  {
    id: 'eboard-results',
    title: 'শিক্ষা বোর্ড রেজাল্ট (SSC, HSC, Dakhil)',
    titleEn: 'Education Board Results & Marksheet',
    category: 'Education',
    url: 'https://eboardresults.com/v2/home',
    dept: 'মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড',
    description: 'এসএসসি, এইচএসসি, দাখিল ও আলিম পরীক্ষার পূর্ণাঙ্গ বিষয়ভিত্তিক মার্কশিট অনুসন্ধান।',
    documents: ['পরীক্ষার নাম ও পাসের সাল', 'বোর্ডের নাম', 'রোল নম্বর ও রেজিস্ট্রেশন নম্বর'],
    fee: 'সম্পূর্ণ ফ্রি',
    photoSpec: 'প্রয়োজন নেই',
    tags: ['ssc', 'hsc', 'result', 'রেজাল্ট', 'মার্কশিট', 'শিক্ষা বোর্ড'],
    badge: 'দ্রুত রেজাল্ট',
    featured: true,
  },
  {
    id: 'nu-portal',
    title: 'জাতীয় বিশ্ববিদ্যালয় পোর্টাল (NU)',
    titleEn: 'National University Services',
    category: 'Education',
    url: 'https://www.nu.ac.bd/',
    dept: 'জাতীয় বিশ্ববিদ্যালয়, বাংলাদেশ',
    description: 'অনার্স, ডিগ্রি, মাস্টার্স ভর্তি বিজ্ঞপ্তি, ফরম পূরণ ও ফলাফল তথ্য পোর্টাল।',
    documents: ['এসএসসি ও এইচএসসি রোল ও রেজিস্ট্রেশন', 'মোবাইল নম্বর', 'পাসপোর্ট সাইজ ফটো'],
    fee: 'ভর্তি আবেদন ২৫০-৩৫০ টাকা (মোবাইল ব্যাংকিং)',
    photoSpec: 'রঙিন ছবি: ১২০ × ১৫০ px বা ৩০০ × ৩০০ px',
    photoStudioPreset: 'passport',
    tags: ['nu', 'national university', 'ভর্তি', 'অনার্স', 'ডিগ্রি', 'ফরম পূরণ'],
    featured: false,
  },
  {
    id: 'muktopaath',
    title: 'মুক্তপাঠ ই-লার্নিং প্ল্যাটফর্ম',
    titleEn: 'Muktopaath Govt Certified e-Learning',
    category: 'Education',
    url: 'https://muktopaath.gov.bd/',
    dept: 'এটুআই (a2i) ও মন্ত্রিপরিষদ বিভাগ',
    description: 'সরকারি-বেসরকারি বিভিন্ন বিষয়ে ফ্রি ও পেইড অনলাইন কোর্স ও সার্টিফিকেট অর্জন।',
    documents: ['ইমেইল বা মোবাইল নম্বর', 'শিক্ষাগত বিবরণী'],
    fee: 'অধিকাংশ কোর্স সম্পূর্ণ ফ্রি',
    photoSpec: 'প্রোফাইল ছবি',
    tags: ['muktopaath', 'course', 'training', 'মুক্তপাঠ', 'অনলাইন কোর্স', 'ট্রেনিং'],
    featured: false,
  },
  {
    id: 'mygov-bd',
    title: 'মাইগভ বাংলাদেশ (এক ঠিকানায় সকল সেবা)',
    titleEn: 'MyGov Citizen Portal',
    category: 'Govt Services',
    url: 'https://www.mygov.bd/',
    dept: 'আইসিটি বিভাগ ও মন্ত্রিপরিষদ বিভাগ',
    description: 'সকল সরকারি সার্টিফিকেট, প্রত্যয়ন ও নাগরিক সেবার সমন্বিত ওয়ান-স্টপ প্ল্যাটফর্ম।',
    documents: ['জাতীয় পরিচয়পত্র', 'সংশ্লিষ্ট সেবার প্রমাণপত্র'],
    fee: 'সেবাভেদে নির্ধারিত',
    photoSpec: '৩০০ × ৩০০ পাসপোর্ট সাইজ',
    tags: ['mygov', 'citizen services', 'মাইগভ', 'নাগরিক সেবা', 'সনদ'],
    badge: 'ডিজিটাল বাংলাদেশ',
    featured: true,
  },
  {
    id: 'eksheba-bd',
    title: 'একসেবা নাগরিক পোর্টাল',
    titleEn: 'EkSheba Portal',
    category: 'Govt Services',
    url: 'https://eksheba.gov.bd/',
    dept: 'এটুআই প্রোগ্রাম (a2i)',
    description: 'ইউনিয়ন ডিজিটাল সেন্টার (ইউডিসি) ও নাগরিকদের জন্য কেন্দ্রীয় সেবা প্ল্যাটফর্ম।',
    documents: ['নাগরিক সনদ', 'এনআইডি নম্বর'],
    fee: 'সেবাভেদে নির্ধারিত',
    photoSpec: 'পাসপোর্ট সাইজ ছবি',
    tags: ['eksheba', 'udc', 'একসেবা', 'ডিজিটাল সেন্টার'],
    featured: false,
  },
  {
    id: 'echallan-portal',
    title: 'এ-চালান স্বয়ংক্রিয় চালান পদ্ধতি',
    titleEn: 'A-Challan Online Govt Fee Payment',
    category: 'Banking & Utility',
    url: 'https://www.ibass2.gov.bd/achallan/',
    dept: 'অর্থ বিভাগ, অর্থ মন্ত্রণালয়',
    description: 'পাসপোর্ট ফি, পুলিশ ক্লিয়ারেন্স, কোর্ট ফি ও ভ্যাট সরাসরি বাংলাদেশ ব্যাংকে জমা দিন।',
    documents: ['চালানের অর্থনৈতিক কোড', 'আবেদনকারীর এনআইডি বা পাসপোর্ট নম্বর'],
    fee: 'বিকাশ, নগদ, রকেট বা ডেবিট/ক্রেডিট কার্ডের মাধ্যমে তাৎক্ষণিক পরিশোধ',
    photoSpec: 'প্রয়োজন নেই',
    tags: ['challan', 'echallan', 'চালান', 'এ-চালান', 'পাসপোর্ট ফি', 'ব্যাংক চালান'],
    badge: 'ফি পেমেন্ট',
    featured: true,
  },
  {
    id: 'sonali-esheba',
    title: 'সোনালী ই-সেবা পোর্টাল',
    titleEn: 'Sonali Bank e-Sheba',
    category: 'Banking & Utility',
    url: 'https://epay.sonalibank.com.bd/',
    dept: 'সোনালী ব্যাংক পিএলসি',
    description: 'বিশ্ববিদ্যালয় ফি, পাসপোর্ট ফি, আয়কর ও সরকারি বিভিন্ন সেবামূল্য অনলাইন পেমেন্ট।',
    documents: ['পেমেন্ট রেফারেন্স স্লিপ', 'মোবাইল নম্বর'],
    fee: 'নির্ধারিত গেটওয়ে চার্জ প্রযোজ্য',
    photoSpec: 'প্রয়োজন নেই',
    tags: ['sonali', 'bank', 'payment', 'সোনালী ব্যাংক', 'ই-সেবা', 'ফি'],
    featured: false,
  },
  {
    id: 'ami-probashi',
    title: 'আমি প্রবাসী (বৈদেশিক কর্মসংস্থান)',
    titleEn: 'Ami Probashi Portal & BMET',
    category: 'Passport & Travel',
    url: 'https://amiprobashi.com/',
    dept: 'প্রবাসী কল্যাণ ও বৈদেশিক কর্মসংস্থান মন্ত্রণালয়',
    description: 'বিদেশে চাকরির জন্য বিএমইটি স্মার্ট কার্ড নিবন্ধন, প্রি-ডিপারচার ট্রেনিং ও ভিসা যাচাই।',
    documents: ['মূল পাসপোর্ট', 'এনআইডি কার্ড', 'বিদেশি নিয়োগকর্তার ভিসা বা অফার লেটার'],
    fee: 'বিএমইটি রেজিস্ট্রেশন ৩০০ টাকা',
    photoSpec: 'পাসপোর্ট সাইজ ছবি (৩০০ × ৩০০ px)',
    photoStudioPreset: 'passport',
    tags: ['probashi', 'bmet', 'প্রবাসী', 'বিদেশ', 'বিএমইটি', 'ভিসা'],
    featured: false,
  },
  {
    id: 'surokkha-gov',
    title: 'সুরক্ষা ভ্যাকসিন ও সার্টিফিকেট পোর্টাল',
    titleEn: 'Surokkha Vaccine Verification',
    category: 'Govt Services',
    url: 'https://surokkha.gov.bd/',
    dept: 'স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রণালয়',
    description: 'কোভিড-১৯ সহ আন্তর্জাতিক ভ্যাকসিন পাসপোর্ট ও কিউআর-কোড সার্টিফিকেট ডাউনলোড।',
    documents: ['পাসপোর্ট নম্বর অথবা এনআইডি নম্বর', 'নিবন্ধিত মোবাইল নম্বর'],
    fee: 'সম্পূর্ণ ফ্রি',
    photoSpec: 'প্রয়োজন নেই',
    tags: ['surokkha', 'vaccine', 'certificate', 'সুরক্ষা', 'ভ্যাকসিন', 'টিকা'],
    featured: false,
  },
];

const CUSTOM_PORTALS_KEY = 'sebadesk_custom_portals';
const FAVORITE_PORTALS_KEY = 'sebadesk_favorite_portals';

const CATEGORY_META = {
  'Govt Services': {
    icon: Landmark,
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30',
    iconBg: 'bg-gradient-to-br from-emerald-500/15 to-teal-500/15 text-emerald-600 dark:text-emerald-400',
  },
  'NID & Voter': {
    icon: CreditCard,
    badge: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/30',
    iconBg: 'bg-gradient-to-br from-sky-500/15 to-blue-500/15 text-sky-600 dark:text-sky-400',
  },
  'Passport & Travel': {
    icon: BookOpen,
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/30',
    iconBg: 'bg-gradient-to-br from-indigo-500/15 to-violet-500/15 text-indigo-600 dark:text-indigo-400',
  },
  'Jobs & Career': {
    icon: Briefcase,
    badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30',
    iconBg: 'bg-gradient-to-br from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400',
  },
  'Land & Property': {
    icon: MapPin,
    badge: 'bg-lime-50 text-lime-700 border-lime-200 dark:bg-lime-500/10 dark:text-lime-300 dark:border-lime-500/30',
    iconBg: 'bg-gradient-to-br from-lime-500/15 to-emerald-500/15 text-lime-600 dark:text-lime-400',
  },
  Education: {
    icon: GraduationCap,
    badge: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/30',
    iconBg: 'bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 text-violet-600 dark:text-violet-400',
  },
  'Banking & Utility': {
    icon: Building2,
    badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30',
    iconBg: 'bg-gradient-to-br from-rose-500/15 to-pink-500/15 text-rose-600 dark:text-rose-400',
  },
};

export default function PortalHub({ isOnline = true }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [activeGuideModal, setActiveGuideModal] = useState(null);

  // Custom added portals
  const [customPortals, setCustomPortals] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_PORTALS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Favorite portals
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITE_PORTALS_KEY);
      return saved ? JSON.parse(saved) : ['nid-services', 'epassport-portal', 'police-clearance', 'alljobs-teletalk'];
    } catch {
      return ['nid-services', 'epassport-portal', 'police-clearance', 'alljobs-teletalk'];
    }
  });

  // Add Portal Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPortal, setNewPortal] = useState({
    title: '',
    category: 'Govt Services',
    url: '',
    description: '',
  });

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_PORTALS_KEY, JSON.stringify(customPortals));
    } catch {
      // Ignore quota
    }
  }, [customPortals]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITE_PORTALS_KEY, JSON.stringify(favorites));
    } catch {
      // Ignore quota
    }
  }, [favorites]);

  const allPortals = useMemo(() => {
    return [...customPortals, ...OFFICIAL_SERVICES];
  }, [customPortals]);

  const filteredPortals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allPortals.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchFav = !onlyFavorites || favorites.includes(item.id);
      if (!matchCat || !matchFav) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        (item.titleEn && item.titleEn.toLowerCase().includes(q)) ||
        (item.dept && item.dept.toLowerCase().includes(q)) ||
        item.description.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q) ||
        (item.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [allPortals, searchQuery, selectedCategory, onlyFavorites, favorites]);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const copyUrl = (url, id, e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDirectLaunch = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDesktopPopup = (url, title) => {
    const width = 1180;
    const height = 820;
    const left = Math.max(0, (window.screen.width - width) / 2);
    const top = Math.max(0, (window.screen.height - height) / 2);
    window.open(
      url,
      `_blank_${Date.now()}`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
  };

  const handleAddCustomPortal = (e) => {
    e.preventDefault();
    if (!newPortal.title.trim() || !newPortal.url.trim()) return;

    let cleanUrl = newPortal.url.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const created = {
      id: `custom-${Date.now()}`,
      title: newPortal.title.trim(),
      category: newPortal.category,
      url: cleanUrl,
      dept: 'কাস্টম বুকমার্ক',
      description: newPortal.description.trim() || 'ব্যবহারকারীর নিজস্ব কাস্টম লিংক',
      documents: ['ওয়েবসাইট প্রদত্ত নির্দেশনা প্রযোজ্য'],
      fee: 'ওয়েবসাইটে প্রদর্শিত',
      tags: ['custom', newPortal.category.toLowerCase()],
      custom: true,
    };

    setCustomPortals((prev) => [created, ...prev]);
    setShowAddModal(false);
    setNewPortal({ title: '', category: 'Govt Services', url: '', description: '' });
  };

  const handleDeleteCustom = (id, e) => {
    e.stopPropagation();
    setCustomPortals((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans">
      {/* Top Header & Search Bar */}
      <header className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-500 text-white shadow-sm">
                <Globe className="w-5 h-5 animate-pulse-subtle" />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                সেবাডেস্ক পোর্টাল কমান্ড হাব
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 font-medium">
                  ১০০% ভেরিফাইড লিংক
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              বাংলাদেশ সরকার, এনআইডি, পাসপোর্ট, ড্রাইভিং লাইসেন্স, ভূমি সেবা ও চাকরির সকল অফিশিয়াল পোর্টাল এক ক্লিকে
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              নতুন পোর্টাল যোগ করুন
            </button>
          </div>
        </div>

        {/* Search & Category Chips */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="সার্চ করুন (পাসপোর্ট, এনআইডি, পুলিশ ক্লিয়ারেন্স, খতিয়ান, বিসিএস, চাকরি...)"
              className="w-full pl-10 pr-9 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Favorites toggle */}
          <button
            onClick={() => setOnlyFavorites((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border transition-all ${
              onlyFavorites
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current' : ''}`} />
            প্রিয় পোর্টাল ({favorites.length})
          </button>
        </div>

        {/* Category Pills */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Pro-Tip Banner for Studio Operators */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-sky-500/10 to-teal-500/10 border border-indigo-200/50 dark:border-indigo-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-xl bg-indigo-500 text-white shadow-sm mt-0.5">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                💡 সিকিউর ও সরাসরি সেবা গ্যারান্টি
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                সরকারি ওয়েবসাইটগুলো (পাসপোর্ট, এনআইডি, পুলিশ ক্লিয়ারেন্স) ব্যাংকিং ও নিরাপত্তার কারণে অন্য ফ্রেমের মধ্যে ব্লক করে।
                সেবাডেস্কে <strong>'সরাসরি সেবা নিন'</strong> চাপলে কোনো ত্রুটি ছাড়াই অফিশিয়াল সাইট সরাসরি ফুল-ফিচারে ওপেন হবে।
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium whitespace-nowrap">
            মোট পোর্টাল: {filteredPortals.length} টি
          </span>
        </div>

        {/* Portal Grid */}
        {filteredPortals.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
              কোনো পোর্টাল খুঁজে পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              আপনার সার্চ কি-ওয়ার্ড পরিবর্তন করুন অথবা নতুন কাস্টম পোর্টাল যোগ করুন।
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setOnlyFavorites(false);
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              সব পোর্টাল রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPortals.map((portal) => {
              const meta = CATEGORY_META[portal.category] || CATEGORY_META['Govt Services'];
              const IconComponent = meta.icon;
              const isFav = favorites.includes(portal.id);

              return (
                <div
                  key={portal.id}
                  className="group relative flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:border-indigo-300 dark:hover:border-indigo-600 overflow-hidden"
                >
                  {/* Top Bar inside card */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2.5 rounded-xl ${meta.iconBg}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${meta.badge}`}>
                            {portal.category}
                          </span>
                          {portal.dept && (
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[170px] mt-0.5">
                              {portal.dept}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => toggleFavorite(portal.id, e)}
                          title={isFav ? 'প্রিয় তালিকা থেকে বাদ দিন' : 'প্রিয় তালিকায় যোগ করুন'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isFav
                              ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                              : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>

                        {portal.custom && (
                          <button
                            onClick={(e) => handleDeleteCustom(portal.id, e)}
                            title="মুছে ফেলুন"
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {portal.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {portal.description}
                    </p>

                    {/* Official Document Highlights */}
                    {portal.documents && portal.documents.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex flex-col gap-1">
                        <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                          <FileText className="w-3.5 h-3.5 text-indigo-500" />
                          <span>কী কী কাগজপত্র লাগবে:</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-500 dark:text-slate-400">
                          {portal.documents.slice(0, 2).map((doc, i) => (
                            <li key={i} className="truncate">
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Fee Summary */}
                    {portal.fee && (
                      <div className="mt-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{portal.fee}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons Footer */}
                  <div className="p-3 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveGuideModal(portal)}
                      className="px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center gap-1"
                      title="বিস্তারিত নির্দেশিকা দেখুন"
                    >
                      <Info className="w-3.5 h-3.5" />
                      নির্দেশিকা
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => copyUrl(portal.url, portal.id, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-all"
                        title={copiedId === portal.id ? 'লিংক কপি হয়েছে!' : 'লিংক কপি করুন'}
                      >
                        {copiedId === portal.id ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDesktopPopup(portal.url, portal.title)}
                        className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all flex items-center gap-1"
                        title="আলাদা উইন্ডোতে খুলুন"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        উইন্ডো
                      </button>

                      <button
                        onClick={() => handleDirectLaunch(portal.url)}
                        className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow transition-all flex items-center gap-1 active:scale-95"
                      >
                        <span>সরাসরি সেবা নিন</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Guide Details Modal */}
      {activeGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <button
              onClick={() => setActiveGuideModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {activeGuideModal.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {activeGuideModal.title}
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  সার্ভিস বর্ণনা:
                </h4>
                <p className="leading-relaxed">{activeGuideModal.description}</p>
              </div>

              {activeGuideModal.documents && (
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    প্রয়োজনীয় কাগজপত্র ও তথ্যাবলী:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
                    {activeGuideModal.documents.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeGuideModal.fee && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 font-medium">
                  <strong>ফি ও খরচ: </strong> {activeGuideModal.fee}
                </div>
              )}

              {activeGuideModal.photoSpec && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300">
                  <strong>ছবি ও স্বাক্ষরের মাপ: </strong> {activeGuideModal.photoSpec}
                </div>
              )}

              <div className="pt-2">
                <p className="text-[11px] text-slate-400">
                  অফিশিয়াল লিংক: <span className="font-mono">{activeGuideModal.url}</span>
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveGuideModal(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => {
                  handleDirectLaunch(activeGuideModal.url);
                  setActiveGuideModal(null);
                }}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center gap-1.5"
              >
                <span>অফিশিয়াল পোর্টালে যান</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Portal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-500" />
                নতুন পোর্টাল বা ওয়েবসাইট যোগ করুন
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomPortal} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  পোর্টালের নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ঢাকা ওয়াসা অনলাইন বিল"
                  value={newPortal.title}
                  onChange={(e) => setNewPortal({ ...newPortal, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ওয়েবসাইট লিঙ্ক (URL) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://example.gov.bd"
                  value={newPortal.url}
                  onChange={(e) => setNewPortal({ ...newPortal, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ক্যাটাগরি
                </label>
                <select
                  value={newPortal.category}
                  onChange={(e) => setNewPortal({ ...newPortal, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  placeholder="এই পোর্টালে কী কাজ করা যায়..."
                  value={newPortal.description}
                  onChange={(e) => setNewPortal({ ...newPortal, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-sm"
                >
                  যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
