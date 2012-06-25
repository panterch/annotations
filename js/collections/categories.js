define(["order!jquery",
        "order!models/category",
        "order!underscore",
        "order!backbone",
        "order!localstorage"],
    
    function($,Category){
    
        /**
         * Category collection
         * @class
         */
        var Categories = Backbone.Collection.extend({
            model: Category,
            localStorage: new Backbone.LocalStorage("Categories"),
            
            /**
             * @constructor
             */
            initialize: function(models,video){
                _.bindAll(this,"setUrl","addCopyFromTemplate");
                
                this.setUrl(video);                    
            },
            
            parse: function(resp, xhr) {
              if(resp.categories && _.isArray(resp.categories))
                return resp.annotations;
              else if(_.isArray(resp))
                return resp;
              else
                return null;
            },
            
            /**
             * Define the url from the collection with the given video
             *
             * @param {Category} video containing the category
             */
            setUrl: function(video){
                if(!video || !video.collection){ // If a template
                    this.url = window.annotationsTool.restEndpointsUrl + "/categories";
                    this.isTemplate = true;
                }
                else{  // If not a template, we add video url      
                    this.url = video.url() + "/categories";
                    this.isTemplate = false;
                }
                
                this.each(function(category){
                    category.setUrl();
                });
            },
            
            /**
             * Add a copy from the given template to this collection
             *
             * @param {Category} template to copy 
             */
            addCopyFromTemplate: function(element){
                
                // Test if the given category is really a template
                if(!this.isTemplate && !_.isArray(element) && element.id){
                    
                    // Copy the element and remove useless parameters 
                    var copyJSON = element.toJSON();
                    delete copyJSON.id;
                    delete copyJSON.created_at;
                    delete copyJSON.created_by;
                    delete copyJSON.updated_at;
                    delete copyJSON.updated_by;
                    delete copyJSON.deleted_by;
                    delete copyJSON.deleted_at;
                    delete copyJSON.labels;
                    
                    // add the copy url parameter for the backend
                    copyJSON['copyUrl'] = "?category_id="+element.id;
                    
                    return this.create(copyJSON);
                    
                    // TODO add localStorage version
                }
                
                return null;
            }
        });
        
        return Categories;

});
    
    