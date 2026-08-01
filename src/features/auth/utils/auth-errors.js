export default function getAuthErrorMessage(error) {
  switch (error.code) {
    case "auth/operation-not-allowed":
      return "طريقة تسجيل الدخول دي غير مفعلة في Firebase.";
    case "auth/unauthorized-domain":
      return "الدومين الحالي غير مصرح به في Firebase.";
    case "auth/popup-blocked":
      return "المتصفح منع نافذة تسجيل الدخول.";
    case "auth/popup-closed-by-user":
      return "تم إلغاء تسجيل الدخول باستخدام Google.";
    case "auth/cancelled-popup-request":
      return "تم إلغاء طلب تسجيل الدخول.";
    case "auth/account-exists-with-different-credential":
      return "يوجد حساب بهذا البريد باستخدام طريقة تسجيل دخول أخرى.";
    case "auth/email-already-in-use":
      return "البريد الإلكتروني مستخدم بالفعل.";
    case "auth/invalid-email":
      return "البريد الإلكتروني غير صحيح.";
    case "auth/weak-password":
      return "كلمة المرور ضعيفة.";
    case "auth/invalid-credential":
      return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    case "auth/user-not-found":
      return "لا يوجد حساب بهذا البريد.";
    case "auth/wrong-password":
      return "كلمة المرور غير صحيحة.";
    case "auth/network-request-failed":
      return "حدث خطأ في الاتصال بالإنترنت.";
    default:
      return error?.message || "حدث خطأ أثناء تسجيل الدخول.";
  }
}
