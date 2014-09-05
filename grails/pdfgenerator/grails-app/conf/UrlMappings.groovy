class UrlMappings {

	static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

    "/pdf"(controller: "pdf", parseRequest: false) {
        action = [ POST:"generate"]

    }


        "/"(view:"/index")
        "500"(view:'/error')
	}
}
