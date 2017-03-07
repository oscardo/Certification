using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web.Mvc;

namespace Conference.Controllers
{
    public class RegistrationController : Controller
    {
        public ActionResult New(NewRegistrationForm form)
        {
            if (!form.PasswordsMatch)
            {
                ModelState.AddModelError("ConfirmPassword", "Passwords don't match.");    
            }

            if (ModelState.IsValid)
            {
                return Redirect("/registered.htm");
            }
            else
            {
                var errorMessages = ModelState
                    .SelectMany(s => s.Value.Errors)
                    .Select(e => e.ErrorMessage);
                return View("Error", errorMessages);
            }
        }

        public class NewRegistrationForm
        {
            [Required]
            public string FirstName { get; set; }
            [Required]
            public string LastName { get; set; }
            [Required, RegularExpression(@"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")]
            public string EmailAddress { get; set; }
            [Required, RegularExpression("[a-zA-Z0-9]{5,}", ErrorMessage = "Password must be at least 5 characters and contain letters and numbers.")]
            public string Password { get; set; }
            [Required]
            public string ConfirmPassword { get; set; }
            public string WebsiteUrl { get; set; }

            internal bool PasswordsMatch
            {
                get { return Password == ConfirmPassword; }
            }
        }
    }
}