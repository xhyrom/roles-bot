import { ButtonStyle, ComponentType, Snowflake } from 'discord-api-types/v9';
import { resolvePartialEmoji } from './resolveEmoji';

interface Role {
    id: Snowflake;
    style?: ButtonStyle;
    label: string;
    description?: string;
    emoji: string | null;
}

export const resolveButtonComponents = (roles: Array<Role>) => {
    roles = roles.map((r: Role) => {
        const o: any = {
            type: ComponentType.Button,
            style: r.style || ButtonStyle.Secondary,
            label: r.label,
            custom_id: r.id
        };

        if (r.emoji) o.emoji = resolvePartialEmoji(r.emoji);

        return o;
    });

    let finalComponents = [];
    for (let i = 0; i <= roles.length; i += 5) {
        const row: any = {
            type: ComponentType.ActionRow,
            components: []
        };

        const btnslice: any = roles.slice(i, i + 5);
        for (let y = 0; y < btnslice.length; y++) row.components.push(btnslice[y]);
        
        finalComponents.push(row);
    }

    finalComponents = finalComponents.filter(a => a.components.length > 0);
    return finalComponents;
}

export const resolveSelectMenuComponents = (roles: Array<Role>, placeholder?: string) => {
    roles = roles.map((r: Role) => {
        const o: any = {
            label: r.label,
            value: r.id,
            description: r.description,
        };

        if (r.emoji) o.emoji = resolvePartialEmoji(r.emoji);

        return o;
    });

    const actionRow = [
        {
            type: ComponentType.ActionRow,
            components: [
                {
                    type: ComponentType.SelectMenu,
                    custom_id: 'role_select',
                    options: roles,
                }
            ]
        }
    ];

    // @ts-expect-error No typings
    if (placeholder) actionRow[0].components[0].placeholder = placeholder;

    return actionRow;
}