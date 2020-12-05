/* ============================================================== */
/* Template Name : Metronal - Personal Portfolio Page             */
/* Author        : Rietts Andreas Ruff                            */
/* Author URI    : https://themeforest.net/user/riettsruff        */
/* Version       : 1.3                                            */
/* ============================================================== */

;(function ($) {
  "use strict"

  // Init Metronal
  var metronal = {}

  // Init Main Content
  metronal.mainContent = {
    list: ["#home", "#about", "#resume", "#portfolio", "#contact"],
    on: "",
    off: "",
  }

  // Pre Load
  metronal.preLoad = function (duration) {
    $("#pre-load").fadeOut(parseInt(duration, 10))
  }

  // Replace Viewport Height
  // Solves the issue about the viewport height on mobile devices as when the page loads
  metronal.replaceVHeight = function () {
    $("html").css({
      height: $(window).height(),
    })
  }

  // Portfolio Filter
  metronal.portfolioFilter = {
    // Item container
    container: $("#portfolio .portfolio-item .item-wrapper"),
    // Init function
    init: function () {
      // Checking if all images are loaded
      metronal.portfolioFilter.container.imagesLoaded(function () {
        // Init isotope once all images are loaded
        metronal.portfolioFilter.container.isotope({
          itemSelector: "#portfolio .portfolio-item .item-wrapper .item",
          layoutMode: "masonry",
          transitionDuration: "0.8s",
        })
        // Forcing a perfect masonry layout after initial load
        metronal.portfolioFilter.container.isotope("layout")
        // Filter items when the button is clicked
        $("#portfolio .portfolio-filter ul li").on("click", "a", function () {
          // Remove the current class from the previous element
          $("#portfolio .portfolio-filter ul li .current").removeClass(
            "current"
          )
          // Add the current class to the button clicked
          $(this).addClass("current")
          // Data filter
          var selector = $(this).attr("data-filter")
          metronal.portfolioFilter.container.isotope({
            filter: selector,
          })
          setTimeout(function () {
            metronal.portfolioFilter.container.isotope("layout")
          }, 6)
          return false
        })
        // Hide Preload
        metronal.preLoad(800)
      })
    },
  }

  // Use Magnific Popup
  metronal.useMagnificPopup = function () {
    // For portfolio item
    $("#portfolio .portfolio-item .item-wrapper .item").magnificPopup({
      delegate: "a",
      type: "inline",
      removalDelay: 300,
      mainClass: "mfp-fade",
      fixedContentPos: true,
      callbacks: {
        beforeOpen: function () {
          $("html").addClass("mfp-helper")
        },
        close: function () {
          $("html").removeClass("mfp-helper")
        },
      },
    })
  }

  // Set Skill Progress
  metronal.setSkillProgress = function () {
    // Select skill
    var skill = $(".single-skill")
    for (var i = 0; i < skill.length; i++) {
      if (skill.eq(i).find(".percentage")[0].textContent == "100%") {
        skill
          .eq(i)
          .find(".progress-wrapper .progress")
          .css({
            width: skill.eq(i).find(".percentage")[0].textContent,
            borderRight: 0,
          })
      } else {
        skill
          .eq(i)
          .find(".progress-wrapper .progress")
          .css("width", skill.eq(i).find(".percentage")[0].textContent)
      }
    }
  }

  // Use TypeIt.js
  metronal.typeIt = {
    strings: ["Web Developer", "Mobile App Developer"],
    use: function () {
      if (typeof TypeIt != "undefined") {
        new TypeIt(".passion", {
          speed: 200,
          startDelay: 800,
          strings: metronal.typeIt.strings,
          breakLines: false,
          loop: true,
        }).go()
      } else {
        return false
      }
    },
  }

  // Progress Animation
  metronal.progressAnimation = function () {
    // Disable progress animation on IE Browser
    if (
      navigator.userAgent.indexOf("MSIE") !== -1 ||
      navigator.appVersion.indexOf("Trident/") > -1
    ) {
      $(".progress-wrapper .progress").css({
        animation: "none",
      })
    }
  }

  // Dynamic Page
  metronal.dynamicPage = function (event, target) {
    if (!event) {
      if (!target) {
        $("#home").addClass("active")
        metronal.mainContent.on = metronal.mainContent.off = "#home"
      } else {
        if (metronal.mainContent.list.includes(target)) {
          $(target).addClass("active")
          metronal.mainContent.on = metronal.mainContent.off = target
        } else {
          $("#home").addClass("active")
          metronal.mainContent.on = metronal.mainContent.off = "#home"
        }
      }
    } else {
      var currentTarget = event.currentTarget
      var prevMainContentOff = metronal.mainContent.off,
        targetOff = metronal.mainContent.on,
        targetOn
      if (
        currentTarget.className === "menu-link" ||
        currentTarget.className === "close-menu-link" ||
        currentTarget.id === "contact-button"
      ) {
        if (metronal.mainContent.list.includes(target)) {
          targetOn = target
        } else {
          return
        }
      } else {
        return
      }

      if (targetOn !== targetOff) {
        $(prevMainContentOff).removeClass("scaleDownCenter")
        $(targetOff).removeClass("scaleDownCenter")
        $(targetOff).removeClass("scaleUpCenter active")
        $(targetOff).addClass("scaleDownCenter")
        $(targetOn).addClass("scaleUpCenter active")

        metronal.mainContent.off = targetOff
        metronal.mainContent.on = targetOn
      }
    }
  }

  // Process Contact Form
  metronal.processContactForm = function () {
    var form = $('form[name="contact"]'),
      message = $(".contact-msg"),
      formData

    // Success Function
    var doneFunc = function (response) {
      message.text(response)
      message.removeClass("alert-danger").addClass("alert-success").fadeIn()
      setTimeout(function () {
        message.fadeOut()
      }, 2400)
      form.find('input:not([type="submit"]), textarea').val("")
    }

    // Fail Function
    var failFunc = function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 400) {
        message.text(jqXHR.responseText)
      } else {
        message.text(jqXHR.statusText)
      }
      message.removeClass("alert-success").addClass("alert-danger").fadeIn()
      setTimeout(function () {
        message.fadeOut()
      }, 2400)
    }

    // Form On Submit
    form.on("submit", function (e) {
      e.preventDefault()
      formData = $(this).serialize()
      $.ajax({
        type: "POST",
        url: form.attr("action"),
        data: formData,
      })
        .done(doneFunc)
        .fail(failFunc)
    })
  }

  // Fetcher
  metronal.repositories = {
    // API Base Url
    baseUrl: "https://rizalord-portfolio-cms.herokuapp.com",
    // baseUrl: "http://localhost:1337",
    // Getter
    init: () =>
      new Promise((resolve, reject) => {
        axios
          .get(metronal.repositories.baseUrl + "/profile")
          .then(({ data }) => resolve(data))
          .catch((err) => reject(err))
      }),
  }

  metronal.dumper = {
    toYMD: function dateToYMD(date) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ]

      var d = monthNames[date.getDate() - 1]
      var m = date.getMonth() + 1
      var y = date.getFullYear()
      return `${m} ${d} ${y}`
    },
    setService: function (services) {
      return services.reduce(
        (total, currentValue, currentIndex) =>
          total +
          `<div class="single-service col-sm-6 col-12">
        	<ul>
        		<li class="service-number">
        			<span class="first-word">Service</span>
        			<span class="second-word">0${currentIndex + 1}</span>
        		</li>
        		<li>
        			<ul>
        				<li class="service-name">
        					<i class="fas fa-angle-double-right"></i><span>${
                    currentValue.name
                  }</span>
        				</li>
        				<li class="service-body">${currentValue.description}</li>
        			</ul>
        		</li>
        	</ul>
        </div>`,
        ""
      )
    },
    setSoftSkill: function (soft_skills) {
      return soft_skills.reduce(
        (total, currentValue) =>
          total +
          `<li class="single-skill">
																<ul>
																	<li class="skill-name">
																		<i class="fas fa-angle-double-right"></i><span>${currentValue.name}</span>
																	</li>
																	<li class="percentage">${currentValue.value}%</li>
																	<li class="progress-wrapper">
																		<span class="progress" style="width: ${currentValue.value}%;"></span>
																	</li>
																</ul>
															</li>`,
        ""
      )
    },
    setHardSkill: function (hard_skills) {
      return hard_skills.reduce(
        (total, currentValue) =>
          total +
          `<li class="single-skill">
																<ul>
																	<li class="skill-name">
																		<i class="fas fa-angle-double-right"></i><span>${currentValue.name}</span>
																	</li>
																	<li class="percentage">${currentValue.value}%</li>
																	<li class="progress-wrapper">
																		<span class="progress" style="width: ${currentValue.value}%;"></span>
																	</li>
																</ul>
															</li>`,
        ""
      )
    },
    setEducation: function (educations) {
      return educations.reduce(
        (total, value) => {
          const firstYear = new Date(value.date_start).getFullYear()
          const lastYear = value.is_ongoing
            ? "Present"
            : new Date(value.date_end).getFullYear()
          return (
            total +
            `<div class="single-education col-sm-6 col-12">
							<ul>
								<li class="education-when-where">
									<span class="when">${firstYear} - ${lastYear}</span>
									<span class="where">${value.instance_name}</span>
								</li>
							</ul>
					</div>`
          )
        },

        ""
      )
    },
    setExperience: function (experiences) {
      return experiences.reduce((total, value) => {
        const firstYear = new Date(value.date_start).getFullYear()
        const lastYear = new Date(value.date_end).getFullYear()
        return (
          total +
          `<div class="single-experience col-sm-6 col-12">
			        <ul>
        				<li class="experience-when-where">
        					<span class="when">${firstYear} - ${lastYear}</span>
        					<span class="where">${value.instance_name}</span>
        				</li>
        				<li>
        					<ul>
        						<li class="experience-name">
        							<i class="fas fa-angle-double-right"></i><span>${value.role}</span>
        						</li>
        						<li class="experience-body">
        							${value.description}
        						</li>
        					</ul>
        				</li>
        			</ul>
        		</div>`
        )
      }, "")
    },

    setFunFact: function (fun_facts) {
      return fun_facts.reduce((total, value) => {
        return (
          total +
          `<div class="single-fun-fact col-12 col-sm-4">
      			<ul>
      				<li class="fun-fact-icon">
      					<i class="fas ${value.icon_name} fa-3x"></i>
      				</li>
      				<li class="fun-fact-value">${value.value}+</li>
      				<li class="fun-fact-body">
      					<i class="fas fa-angle-double-right"></i><span>${value.title}</span>
      				</li>
      			</ul>
      		</div>`
        )
      }, "")
    },

    setPortfolioFilter: function (project_categories) {
      return project_categories.reduce(
        (total, value) => {
          return (
            total +
            `<li>
        		<a href="#${value.slug}" data-filter=".${value.slug}">${value.name}</a>
        	</li>`
          )
        },
        `<li>
        		<a href="#" data-filter="*" class="current">All Elements</a>
        	</li>`
      )
    },

    setPortfolioItem: function (projects) {
      projects.sort((a, b) => a.id - b.id)
      return projects.reduce((total, value) => {
        const tags = value.categories.map((e) => e.name).join(", ")
        const classes = value.categories.map(({ slug }) => slug).join(" ")
        const btnVisit =
          value.project_url == null
            ? ``
            : `<a class="project-source" href="${value.project_url}">
        					<span class="front">
        						<i class="fas fa-long-arrow-alt-right"></i>
        						<span class="value">Visit <span>Project</span></span>
        					</span>
        					<span class="back">
        						<i class="fas fa-long-arrow-alt-right"></i>
        						<span class="value">Visit <span>Project</span></span>
        					</span>
        				</a>`
        return (
          total +
          `<div class="item ${classes} col-md-4 col-sm-6 col-12" style="position: absolute; left: 0px; top: 351px;">
        			<!-- Image Starts -->
        			<div class="image">
        				<img src="${metronal.repositories.baseUrl + value.image.formats.small.url}" alt="${
            value.title
          }">
        			</div>
        			<!-- Image Ends -->
        			<!-- Overlay Starts -->
        			<div class="overlay">
        				<!-- View More (Button) Starts -->
        				<a class="view-more" href="#${value.slug}">
        					<span class="front">
        						<i class="far fa-eye"></i><span class="value">View <span>More</span></span>
        					</span>
        					<span class="back">
        						<i class="far fa-eye"></i><span class="value">View <span>More</span></span>
        					</span>
        				</a>
        				<!-- View More (Button) Ends -->
        				<!-- Image Info Starts -->
        				<div class="image-info">
        					<!-- Project Name Starts -->
        					<span class="project-name">${value.title}</span>
        					<!-- Project Name Ends -->
        					<!-- Project Tags Starts -->
        					<span class="project-tags">
        						<!-- Tag Icon Starts -->
        						<span class="tag-icon">
        							<i class="fas fa-tags"></i>
        						</span>
        						<!-- Tag Icon Ends -->
        						<!-- Tag Label Starts -->
        						<span class="tag-label">${tags}</span>
        						<!-- Tag Label Ends -->
        					</span>
        					<!-- Project Tags Ends -->
        				</div>
        				<!-- Image Info Ends -->
        			</div>
        			<!-- Overlay Ends -->
        			<!-- Project Popup Starts -->
        			<div id="${value.slug}" class="project-popup mfp-hide">
        				<!-- Project Picture On Popup Starts -->
        				<img class="project-picture" src="${
                  metronal.repositories.baseUrl + value.image.formats.small.url
                }" alt="${value.title}">
        				<!-- Project Picture On Popup Ends -->
        				<!-- Project Name Starts -->
        				<h5 class="project-name">${value.title}</h5>
        				<!-- Project Name Ends -->
        				<!-- Project Info Starts -->
        				<div class="project-info">
        					<!-- List Info Project Starts -->
        					<ul class="list-info-project">
        						<!-- Single List Starts -->
        						<li>
        							<span class="label">Date</span>
        							<span class="separator">:</span>
        							<span class="value">${metronal.dumper.toYMD(
                        new Date(value.date)
                      )}</span>
        						</li>
        						<!-- Single List Ends -->
        						<!-- Single List Starts -->
        						<li>
        							<span class="label">Categories</span>
        							<span class="separator">:</span>
        							<span class="value">${tags}</span>
        						</li>
        						<!-- Single List Ends -->
        					</ul>
        					<!-- List Info Project Ends -->
        					<!-- Project Description Starts -->
        					<div class="project-description">
        						<!-- Single Paragraph Starts -->
        						<p>${value.description}</p>
        						<!-- Single Paragraph Ends -->
        					</div>
        					<!-- Project Description Ends -->
        				</div>
        				<!-- Project Info Ends -->
                <!-- Project Source Button Starts -->
        				` +
          btnVisit +
          `
        				<!-- Project Source Button Ends -->
        			</div>
        			<!-- Project Popup Ends -->
        		</div>`
        )
      }, ``)
    },
  }

  // Install Data
  metronal.install = function (data) {
    const {
      developer_roles,
      personal_info,
      social_media,
      services,
      soft_skills,
      hard_skills,
      educations,
      experiences,
      fun_facts,
      contact_info,
      project_categories,
      projects,
    } = data

    metronal.typeIt.strings = developer_roles.map((e) => e.name)

    $("#my-personal-description").html(personal_info.description)
    $(".first-name").html(personal_info.first_name)
    $(".last-name").html(personal_info.last_name)
    $(".dob").html(metronal.dumper.toYMD(new Date(personal_info.dob)))
    $(".nationality").html(personal_info.nationality)
    $(".phone").html(personal_info.phone)
    $(".email").html(personal_info.email)
    $(".address").html(personal_info.address)
    $(".languages").html(personal_info.languages)
    $(".website").html(contact_info.website)
    $(".facebook_url").attr("href", social_media.facebook_url)
    $(".linkedin_url").attr("href", social_media.linkedin_url)
    $(".twitter_url").attr("href", social_media.twitter_url)
    $(".instagram_url").attr("href", social_media.instagram_url)
    $("#service-container").html(metronal.dumper.setService(services))
    $("#soft-skill-container").html(metronal.dumper.setSoftSkill(soft_skills))
    $("#hard-skill-container").html(metronal.dumper.setHardSkill(hard_skills))
    $("#education-container").html(metronal.dumper.setEducation(educations))
    $("#experience-container").html(metronal.dumper.setExperience(experiences))
    $("#fun-fact-container").html(metronal.dumper.setFunFact(fun_facts))
    $("#portfolio-filter").html(
      metronal.dumper.setPortfolioFilter(project_categories)
    )
    $("#portfolio-item-container").html(
      metronal.dumper.setPortfolioItem(projects)
    )
  }

  // Window On Resize
  $(window).on("resize", function () {
    metronal.replaceVHeight(),
      metronal.portfolioFilter.container.isotope("layout")
  })

  // Device Orientation Changes
  window.addEventListener(
    "orientationchange",
    function () {
      metronal.replaceVHeight(),
        metronal.portfolioFilter.container.isotope("layout")
    },
    false
  )

  // Menu Link On Click
  $(".menu-link").on("click", function (e) {
    metronal.dynamicPage(e, $(this)[0].hash)
  })

  // Close Menu Link On Click
  $(".close-menu-link").on("click", function (e) {
    metronal.dynamicPage(e, $(this)[0].hash)
  })

  // Contact Button On Click
  $("#contact-button").on("click", function (e) {
    metronal.dynamicPage(e, $(this)[0].hash)
  })

  // Prevent Default 'a[href=""]' click
  $('a[href="#"]').on("click", function (e) {
    e.preventDefault()
  })

  // Window On Load
  //   $(window).on("load", function () {
  //     metronal.preLoad(800)
  //   })

  // Document Ready
  $(document).ready(async function () {
    const repositories = await metronal.repositories.init()

    metronal.install(repositories)
    metronal.dynamicPage(undefined, window.location.hash)
    metronal.replaceVHeight()
    metronal.portfolioFilter.init()
    metronal.useMagnificPopup()
    metronal.setSkillProgress()
    metronal.progressAnimation()
    metronal.typeIt.use()
    metronal.processContactForm()
  })
})(jQuery)
