<script lang="ts">
    export let title: string;
    export let slug: string;
    export let previewText: string;
    export let imageSrc: string; 
    export let imageAltText: string;

    import Image from "$lib/atoms/image/Image.svelte";
</script>

<style>
    article {
        width: 100%;
    }

    a::after {
        content: "";
        clear: both;
        display: table;
    }

    a {
        color: #000;
        display: block;
        text-decoration: none;
    }

    a:hover {
        background-color: #ddd;

        transition: 200ms ease-in-out;

        margin: -1em;
        padding: 1em;
    }

    p {
        line-height: 1.3rem;
        font-size: 1rem;
    }
</style>

<article>
    <a href="/blog{slug}">
        <h1>{title}</h1>
        <Image image={imageSrc} altText={imageAltText} width={250} left={true} />
        <p>{previewText}</p>
    </a>
</article>