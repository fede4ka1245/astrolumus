export interface ICourseLesson {
  id: number;
  title: string;
  description: string;
  order: number;
  updated: string;
  created: string;
  publish_date: string;
  course: number;
  module: number;
}

export interface ICourseModule {
  id: number;
  lessons: ICourseLesson[];
  lessons_count: number,
  title: string;
  description: string;
  order: number;
  updated: string;
  created: string;
  publish_date: string;
  course: number;
}

export interface ICourseAdditionalField {
  id: number;
  title: string;
  description: string;
  show: boolean;
  order: number;
  course: number;
}

export interface ICourseVideoPresentation {
  id: number;
  title: string;
  link: string;
  show: boolean;
  order: number;
  course: number;
}

export interface IForWhomCourses {
  id: number;
  order: number;
  title: string;
  description: string;
  show: boolean;
  course: number;
}

export interface ICourseTeacher {
  first_name: string;
  last_name: string;
  avatar: string | null;
  teacher_title: string;
  teacher_description: string; 
  shadow?: string;
}

export interface IWithinCourses {
  id: number;
  order: number;
  description: string;
  show: boolean;
  course: number;
}

export interface ICourseWhatYouBuys {
  id: number;
  description: string;
  order: number;
  show: boolean;
  course: number;
}

export interface ICoursePaymentOptions {
  id: number;
  title: string;
  description: string;
  description_price: string;
  full_price: number;
  discount_price: number;
  payment_link: string;
  show: boolean;
  order: number;
  course: number;
  payment_option_type: number;
}

export interface ICourse {
  id:number;
  lesson_count: number;
  lessons: ICourseLesson[];
  module_count: number;
  modules: ICourseModule[];
  additional_fields: ICourseAdditionalField[];
  video_presentations: ICourseVideoPresentation[];
  for_whom_courses: IForWhomCourses[];
  teachers: ICourseTeacher[];
  within_courses: IWithinCourses[];
  what_you_buys: ICourseWhatYouBuys[];
  payment_options: ICoursePaymentOptions[];
  title: string[];
  description: string;
  image: string | null;
  price: number;
  course_type: number;
  publish_start: string;
  stage_name: string;
  enroll_in_course: string;
  duration: string;
  nominal_certificate: string;
  why_our_students_elite: string;
  become_member_link: string;
  get_consultation_link: string;
}
