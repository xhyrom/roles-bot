let json = {
    roles: []
}

$('input').change((e) => {
    json[e.currentTarget.id] = e.currentTarget.value;

    document.getElementById('json').innerHTML = hljs.highlight(JSON.stringify(json), { language: 'json' }).value;
})

$('button[id=addRole]').click((e) => {
    Swal.fire({
        title: 'Add Role',
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="Button Label*" required>' +
            '<input id="swal-input2" class="swal2-input" placeholder="Role Id*" required>' +
            '<input id="swal-input3" class="swal2-input" placeholder="Emoji">',
        preConfirm: function () {
            return new Promise(function (resolve) {
                resolve([
                    $('#swal-input1').val(),
                    $('#swal-input2').val(),
                    $('#swal-input3').val()
                ])
            })
        },
    }).then(function (result) {
        if (result.value?.[0] && result.value?.[1]) {
            json.roles.push({
                id: result.value[1],
                label: result.value[0],
                emoji: result.value[2] || null
            })

            document.getElementById('json').innerHTML = hljs.highlight(JSON.stringify(json), { language: 'json' }).value;
        } else Swal.fire('Missing parameters')
    }).catch(swal.noop)
})

$('pre[id=jsonPre].copy').click((e) => {
    navigator.clipboard.writeText(e?.currentTarget?.textContent || e.textContent);

    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Copied!',
        showConfirmButton: false,
        timer: 1500
    })
})

$(window).on('load', () => {
    $('input').toArray().forEach((i) => i.value = '');
    document.getElementById('json').innerHTML = hljs.highlight(JSON.stringify(json), { language: 'json' }).value;
})