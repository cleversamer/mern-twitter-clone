const system = Object.freeze({
  internal: {
    en: "An unexpected error happened on the server",
    ar: "حصل خطأ في السيرفر الداخلي",
  },
  unsupportedRoute: {
    en: "Unsupported route",
    ar: "الرابط غير مدعوم",
  },
  noFile: {
    en: "Please add a file",
    ar: "يجب عليك إضافة ملف",
  },
  invalidFile: {
    en: "Invalid file",
    ar: "الملف غير صالح",
  },
  fileUploadError: {
    en: "Error uploading file",
    ar: "حصل خطأ عند رفع الملف",
  },
  invalidUrl: {
    en: "Please add a valid url",
    ar: "من فضلك قم بإدخال رابط صالح",
  },
  invalidExtension: {
    en: "File extension is not supported",
    ar: "إمتداد الملف غير مدعوم",
  },
  invalidMongoId: {
    en: "Invalid document id",
    ar: "معرّف المستند غير صالح",
  },
  noMongoId: {
    en: "You should add the id",
    ar: "يجب عليك إضافة المعرّف",
  },
});

const auth = Object.freeze({
  invalidCode: {
    en: "Invalid verification code",
    ar: "الكود غير صالح",
  },
  incorrectCode: {
    en: "Incorrect verification code",
    ar: "الكود خاطئ",
  },
  expiredCode: {
    en: "Verification code is expired",
    ar: "الكود منتهي الصلاحية",
  },
  invalidToken: {
    en: "You're unauthorized",
    ar: "يجب عليك تسجيل الدخول",
  },
  hasNoRights: {
    en: "You don't have enough rights",
    ar: "ليس لديك الصلاحيات الكافية",
  },
  emailNotVerified: {
    en: "Your email is not verified",
    ar: "بريدك الإلكتروني غير مفعل",
  },
  emailNotUsed: {
    en: "Email is not used",
    ar: "البريد الإلكتروني غير مستخدم",
  },
  emailUsed: {
    en: "Email is already used",
    ar: "البريد الإلكتروني مستخدم مسبقاً",
  },
  incorrectCredentials: {
    en: "Incorrect email or password",
    ar: "البريد الإلكتروني أو كلمة المرور غير صحيح",
  },
  invalidName: {
    en: "Name should be (8 ~ 64 characters) length",
    ar: "الإسم يجب أن يكون بين 8-64 حرفا",
  },
  invalidEmail: {
    en: "Invalid email address",
    ar: "البريد الإلكتروني غير صالح",
  },
  invalidPassword: {
    en: "Password should be (8 ~ 32 characters) length",
    ar: "كلمة المرور يجب أن تكون بين 8-32 حرفا",
  },
});

const user = Object.freeze({
  invalidId: {
    en: "Invalid user id",
    ar: "معرّف المستخدم غير صالح",
  },
  notFound: {
    en: "User was not found",
    ar: "المستخدم غير موجود",
  },
  alreadyVerified: {
    en: "User is already verified",
    ar: "تم التحقق من البريد مسبقا",
  },
  invalidRole: {
    en: "Invalid user role",
    ar: "الصلاحية المختارة غير صالحة",
  },
});

const codes = Object.freeze({
  duplicateIndexKey: 11000,
});

module.exports = {
  system,
  auth,
  user,
  codes,
};
