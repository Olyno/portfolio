<script>

    import { translations as _ } from '../stores';


</script>

<style>

    .sidebar-icon {
        width: 30px;
        height: 30px;
    }

    .sidebar-link {
        width: 50%;
        margin-left: auto;
        margin-right: auto;
        margin-top: 20px;
        text-align: center;
    }

    .sidebar-link:hover .sidebar-icon {
        color: #4b5a80 !important;
    }

    .sidebar-content {
        position: fixed;
        width: inherit;
        margin-top: 15%;
    }

</style>

<div class="sidebar-content">
    <div class="sidebar-link">
        <a aria-label="{$_.about_me.home_button}" href="/">
            <i class="sidebar-icon is-primary fas fa-home"></i>
        </a>
    </div>
    <div class="sidebar-link">
        <a aria-label="{$_.about_me.button}" href="/me">
            <i class="sidebar-icon is-primary fas fa-user"></i>
        </a>
    </div>
    <div class="sidebar-link">
        <a aria-label="{$_.projects.button}" href="/projects">
            <i class="sidebar-icon is-primary fas fa-folder"></i>
        </a>
    </div>
    <div class="sidebar-link">
        <a aria-label="{$_.comissions.button}" href="/comissions_and_donations">
            <i class="sidebar-icon is-primary fas fa-hand-holding-usd"></i>
        </a>
    </div>
    <div class="sidebar-link">
        <a aria-label="{$_.contact.button}" href="/contact">
            <i class="sidebar-icon is-primary fas fa-phone"></i>
        </a>
    </div>
</div>