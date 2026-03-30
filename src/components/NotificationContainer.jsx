import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../utils/notificationSlice';
import NotificationToast from './NotificationToast';

const NotificationContainer = () => {
  const notifications = useSelector(store => store.notifications.notifications);
  const dispatch = useDispatch();

  const handleRemoveNotification = (id) => {
    dispatch(removeNotification(id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => handleRemoveNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;