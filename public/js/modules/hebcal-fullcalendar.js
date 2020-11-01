document.addEventListener('DOMContentLoaded', function() {
    const il = getLocation();
    var calendarEl = document.getElementById('calendar');
    var calendar = window['hebcalFullCalendar'] = new FullCalendar.Calendar(calendarEl, {
        locale: 'he',
        plugins: [ 'dayGrid' ],
        defaultView: 'dayGridMonth',
        header: {
            left: 'today',
            center: 'title',
            right: 'next, prev',
        },
        buttonText: {
            today: 'היום'
        },
        buttonIcons:  {
            prev: 'chevron-right',
            next: 'chevron-left'
        },
        timezone: false,
        events: {
            url: `https://www.hebcal.com/hebcal/?cfg=fc&v=1&i=${il}&maj=on&min=on&mf=on&ss=on&mod=on&lg=h&s=on&d=on&o=on`,
            cache: true
        }
    });
    console.log(calendar);
  
    calendar.render();
    // refactToHebrew();

    document.addEventListener('keydown', function(e) {
        if (e.keyCode == 37) {
            calendar.prev();
            // refactToHebrew();
        } else if (e.keyCode == 39) {
            calendar.next();
            // refactToHebrew();
        }
    });

    function getLocation() {
        const data = $('#form-city input').data('israel');
        let il = '';
        if (data) {
            il = 'on';
        } else {
            il = 'off';
        }
        return il;
    }

    // // refact days to hebrew
    // function refactToHebrew() {
    //         $('.fc-today-button').html('היום');
    //         const dayHeader = $('.fc-day-header span');
    //         const days = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'שבת קודש'];
    //         console.log(dayHeader);
    //         $(dayHeader).each(function (i, val) {
    //             $(val).html(days[i]);
    //         });
    // };

});
