import Image from "$lib/atoms/image/Image.svelte";
import BuilderBlogPostList from "$lib/organisms/blog_summary/BuilderBlogPostList.svelte";

export const CUSTOM_COMPONENTS = [{
    component: BuilderBlogPostList,
    name: 'Blog Summary',
    inputs: [{ 
        name: "tag", type: "text" 
    }],
    image: "https://tabler-icons.io/static/tabler-icons/icons-png/article.png" 
},{
    component: Image,
    name: 'Image',
    override: true,
    inputs:[{
        name: "tags", type: "text"
    }],
    image: "https://tabler-icons.io/static/tabler-icons/icons-png/photo-scan.png" 
}]