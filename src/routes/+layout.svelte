<script lang="ts" module>
	declare global {
		interface Window {
			analytics: {
				init: (config?: any) => void;
				trackPageview?: () => void;
				trackEvent?: (type: string, fields?: object) => void;
				setExperimentContext?: (experiments: Record<string, string>, anonId: string) => void;
			};
			firebase: any;
		}
	}
</script>

<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
    import { onMount, setContext } from 'svelte';
    import FixedCta from './components/FixedCta.svelte';
    import { writable, type Writable } from 'svelte/store';
    import { json } from '@sveltejs/kit';
    import Navbar from './sections/Navbar.svelte';
	
	const { data, children } = $props<{
    	data: { experiments: Record<string, string>; anonId?: string };
    	children?: any;
  	}>();

	const experimentsStore: Writable<Record<string, string>> =
    writable(data.experiments ?? {});
  	setContext('experiments', experimentsStore);

	$effect(() => {
    	experimentsStore.set(data.experiments ?? {});
  	});

	onMount(() => {
		function initTracking()
		{
			if(window.analytics){
				window.analytics.init({project: 'sws-ecom-template'});
				if(data.experiments){
					window.analytics.setExperimentContext?.(data.experiments, data.anonId);
				}
			}
			else{
				console.log('Analytics not initialized');
			}
		}
		initTracking();
		if(data.experiments)
		{
			console.log(JSON.stringify(data.experiments));
		} else 
		{
			console.log('No experiments');
		}
	})
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="poppins">
	<Navbar/>
	{@render children?.()}
	
	<FixedCta/>
</div>
