<script>

    import { contacts } from '../data';
    import { translations as _ } from '../stores';

</script>

<style>
    .contact-card {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: auto;
        width: 60px;
        height: 60px;
        border-radius: 10px;
        background: #586994;
        box-shadow: 6px 6px 12px #4b597e, -2px -2px 1px #6579aa;
    }
    .contact-card-icon {
        width: 30px;
        height: 30px;
    }
</style>

<div class="section">
    <h1 class="title is-secondary" data-aos="slide-right" data-aos-duration="1000">{$_.contact.title}</h1>
</div>

<div class="small-section">
    <div class="columns">

        <div class="column">
            <div class="small-section" data-aos="fade-up" data-aos-duration="2000">
                <h1 class="title is-4 is-secondary">{$_.contact.email_contact}</h1>
                <a aria-label="{$_.contact.using} email" class="is-secondary" href="mailto:olyno.dev@gmail.com">
                    olyno.dev@gmail.com
                </a>
            </div>
        </div>

        <div class="column">
            <h1 class="title is-4 is-secondary small-section" data-aos="fade-up" data-aos-duration="2000">{$_.contact.message_contact}</h1>
            <div class="columns is-mobile is-multiline">
                {#each contacts as contact, id}
                    <div class="column is-3">
                        <div
                            data-aos="fade-up"
                            data-aos-duration="{id}000"
                            data-aos-delay="100"
                            class="contact-card"
                        >
                            <a aria-label="{$_.contact.using} {contact.name}" href="{contact.link}" rel="noreferrer" target="_blank">
                                <i class="contact-card-icon is-secondary {contact.icon}"></i>
                            </a>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

    </div>
</div>