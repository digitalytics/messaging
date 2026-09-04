
import Menu, { SubMenu, MenuItem } from 'rc-menu';
import 'rc-menu/assets/index.css';
import { useNavigate } from 'react-router-dom';
import configuration from '../config';


export default function Navigation() {
    const navigate = useNavigate();

    return (
        <Menu mode="horizontal">
            <MenuItem key={'dashboard'} onClick={() => navigate('/dashboard')}>Dashboard</MenuItem>
            {(configuration?.accessRight("admin")?.is_view || configuration?.accessRight("role")?.is_view || configuration?.accessRight("permission")?.is_view) ?
                < SubMenu key={'users'} title="Users">
                    {configuration?.accessRight("admin")?.is_view ? <MenuItem key={'admin'} onClick={() => navigate('/admin')}>User</MenuItem> : null}
                    {configuration?.accessRight("role")?.is_view ? <MenuItem key={'role'} onClick={() => navigate('/roles')}>Role</MenuItem> : null}
                    {configuration?.accessRight("permission")?.is_view ? <MenuItem key={'permission'} onClick={() => navigate('/permission')}>Permission</MenuItem> : null}
                </SubMenu> : null
            }
            {configuration?.accessRight("waitingList")?.is_view ? <MenuItem key={'waitingList'} onClick={() => navigate('/wait-list')}>Waiting list</MenuItem> : null}
            {configuration?.accessRight("notification")?.is_view ? <MenuItem key={'notification'} onClick={() => navigate('/notification')}>Notifications</MenuItem> : null}
        </Menu >
    )
}