using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace Conference.Controllers
{
    public class ScheduleController : Controller
    {
        public class ScheduleItem
        {
            public string id { get; set; }
            public string title { get; set; }
            public string subTitle { get; set; }
            public string speakerName { get; set; }
            public string start { get; set; }
            public string end { get; set; }
            public int[] tracks { get; set; }
            public string room { get; set; }
            public int starCount { get; set; }
        }

        static readonly Random random = new Random();
        static readonly IEnumerable<ScheduleItem> schedule;

        static int RandomStarCount()
        {
            return random.Next(5, 99);
        }

        static ScheduleController()
        {
            schedule = new[]
            {
                new ScheduleItem
                {
                    id = "session-1",
                    title = "Registration",
                    subTitle = "Get your name badge and goody bag",
                    speakerName = null,
                    start = "08:30",
                    end = "08:55",
                    tracks = new[] {1, 2},
                    room = "A",
                    starCount = RandomStarCount()
                },
                new ScheduleItem
                {
                    id = "session-2",
                    title = "Moving the Web forward with HTML5",
                    subTitle = "",
                    speakerName = "Melissa Kerr",
                    start = "09:00",
                    end = "09:55",
                    tracks = new[] {1, 2},
                    room = "A",
                    starCount = RandomStarCount()
                },
                new ScheduleItem
                {
                    id = "session-3",
                    title = "Diving in at the deep end with Canvas",
                    subTitle = "",
                    speakerName = "David Alexander",
                    start = "10:00",
                    end = "10:55",
                    tracks = new[] {1},
                    room = "A",
                    starCount = RandomStarCount()
                },
                new ScheduleItem
                {
                    id = "session-4",
                    title = "New Technologies in Enterprise",
                    subTitle = "",
                    speakerName = "April Meyer",
                    start = "10:00",
                    end = "11:55",
                    tracks = new[] {2},
                    room = "B",
                    starCount = RandomStarCount()
                },
                new ScheduleItem
                {
                    id = "session-5",
                    title = "WebSockets and You",
                    subTitle = "",
                    speakerName = "Mark Hanson",
                    start = "11:00",
                    end = "11:55",
                    tracks = new[] {1},
                    room = "A",
                    starCount = RandomStarCount()
                },
                new ScheduleItem
                {
                    id = "session-6",
                    title = "Coffee and Cake Break",
                    subTitle = "Get all the caffeine and sugar you can - you're going to need it!",
                    speakerName = null,
                    start = "12:00",
                    end = "12:25",
                    tracks = new[] {1, 2},
                    room = "A",
                    starCount = RandomStarCount()
                },
                new ScheduleItem
                {
                    id = "session-7",
                    title = "Building Responsive UIs",
                    subTitle = "",
                    speakerName = "Dylan Miller",
                    start = "12:30",
                    end = "12:55",
                    tracks = new[] {1},
                    room = "A",
                    starCount = RandomStarCount()
                },
                new ScheduleItem
                {
                    id = "session-8",
                    title = "Fun with Forms (no, really!)",
                    subTitle = "",
                    speakerName = "Anne Wallace",
                    start = "12:30",
                    end = "12:55",
                    tracks = new[] {2},
                    room = "B",
                    starCount = RandomStarCount()
                },
                new ScheduleItem
                {
                    id = "session-9",
                    title = "A Fresh Look at Layouts",
                    subTitle = "",
                    speakerName = "William Flash",
                    start = "13:00",
                    end = "13:55",
                    tracks = new[] {1},
                    room = "A",
                    starCount = RandomStarCount()
                },
                new ScheduleItem
                {
                    id = "session-10",
                    title = "Real-world Applications of HTML5 APIs",
                    subTitle = "",
                    speakerName = "Ken Ewert",
                    start = "13:00",
                    end = "13:55",
                    tracks = new[] {2},
                    room = "B",
                    starCount = RandomStarCount()
                },
                new ScheduleItem
                {
                    id = "session-11",
                    title = "Lunch",
                    subTitle = "Sponsored by Medior Inc",
                    speakerName = null,
                    start = "14:00",
                    end = "15:25",
                    tracks = new[] {1, 2},
                    room = "A",
                    starCount = RandomStarCount()
                },
                new ScheduleItem
                {
                    id = "session-12",
                    title = "Getting to Grips with JavaScript",
                    subTitle = "",
                    speakerName = "Dominik Paiha",
                    start = "15:30",
                    end = "16:25",
                    tracks = new[] {1},
                    room = "A",
                    starCount = RandomStarCount()
                },
                new ScheduleItem
                {
                    id = "session-13",
                    title = "Transforms and Animations",
                    subTitle = "",
                    speakerName = "John Clarkson",
                    start = "15:30",
                    end = "16:25",
                    tracks = new[] {2},
                    room = "B",
                    starCount = RandomStarCount()
                },
                new ScheduleItem
                {
                    id = "session-14",
                    title = "Web Design Adventures with CSS3",
                    subTitle = "",
                    speakerName = "Christine Koch",
                    start = "16:30",
                    end = "17:25",
                    tracks = new[] {1},
                    room = "A",
                    starCount = RandomStarCount()
                },
                new ScheduleItem
                {
                    id = "session-15",
                    title = "Introducing Data Access and Caching",
                    subTitle = "",
                    speakerName = "Nelson Siu",
                    start = "16:30",
                    end = "17:25",
                    tracks = new[] {2},
                    room = "B",
                    starCount = RandomStarCount()
                },
                new ScheduleItem
                {
                    id = "session-16",
                    title = "Closing Thanks and Prizes",
                    subTitle = "",
                    speakerName = null,
                    start = "17:30",
                    end = "17:55",
                    tracks = new[] {1, 2},
                    room = "A",
                    starCount = RandomStarCount()
                }
            };
        }

        public ActionResult List()
        {
            if (Request.Url.Query != "?fail")
            {
                return Json(new { schedule }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                Response.StatusCode = 503;
                return Json(new { message = "Service currently unavailable." }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult Star(string id, bool starred)
        {
            var item = schedule.First(s => s.id == id);
            item.starCount += starred ? 1 : -1;
            return Json(new { item.starCount });
        }
    }
}